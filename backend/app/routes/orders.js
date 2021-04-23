const _ = require("lodash");
const db = require("../db");
const utils = require("../utils");
const { protectedRoute, responses } = require("./context");
const { SUCCESS, FAILED, NOTFOUND } = responses();
const FaceBook = require("../lib/facebook-api");

const dbOrder = db.Order;
const dbVariant = db.Variant;
const dbProduct = db.Product;
const dbCarrier = db.Carrier;
const dbOrderDetail = db.OrderDetail;
const dbShipping = db.ShippingInformation;

const nameOrder = "Order";
const nameOrderDetail = "Order details";

const sendMessageTracking = async (order, status, accessToken = null) => {
	let res = await dbOrder.findOne({ id: order.id });
	let recipientId = null;
	let text = "";
	if (res && res.customer) {
		recipientId = res.customer.facebook_user_id;
		switch (status) {
			case 5:
				let date = utils.formatDate(
					res.shippingInformation[0].receipt_date
				);
				text = `Đơn hàng ${res.code} của bạn đang được giao. Tổng tiền: ${res.total}đ, ngày nhận hàng dự kiến ${date}.`;
				break;
			case 6:
				text = `Đơn hàng ${res.code} của bạn đã được giao thành công. Cảm ơn bạn đã mua hàng ở shop <3.`;
				break;
			case 7:
				text = `Đơn hàng ${res.code} của bạn đã được trả lại cửa hàng. Xin lỗi vì sự bất tiện này.`;

				break;
		}

		if (accessToken) {
			await FaceBook.sendMessage({
				recipientId,
				message: { text },
				accessToken
			});
		}
	}

	return order;
};

const checkExistOrder = async args => {
	let result = null;
	let order = null;
	const { facebookUserId, facebookLivestreamId, customerId, userId } = args;
	let cond = { facebookLivestreamId, userId };

	if (facebookUserId) {
		cond.facebookUserId = facebookUserId;
	} else {
		cond.customerId = customerId;
	}

	order = await dbOrder.findOne(cond);
	if (!order.error) result = order;

	return result;
};

const checkStatusCurrent = async id => {
	let res = await dbOrder.findOne({ id });
	return res.status;
};

const checkStock = async variants => {
	let res = null;
	for await (const variant of variants) {
		res = await dbVariant.findOne({ id: variant.id });
		if (res) {
			res = res.stock >= variant.quantity;
		}
	}
	return res;
};

const updateStock = async (orderId, isSub) => {
	const details = await dbOrderDetail.findAll({ orderId });
	for await (let detail of details) {
		let quantity = Number(detail.quantity);
		let variantId = detail.variant.id;
		let productId = detail.variant.product_id;

		let product = await dbProduct.findOne({ id: productId });
		let stockProduct = Number(product.stock);

		let variant = await dbVariant.findOne({ id: variantId });
		let stockVariant = Number(variant.stock);

		if (isSub) {
			stockProduct -= quantity;
			stockVariant -= quantity;
		} else {
			stockProduct += quantity;
			stockVariant += quantity;
		}

		await dbProduct.update(productId, { stock: stockProduct });
		await dbVariant.update(variantId, { stock: stockVariant });
	}
};

const updatePriceWithShipping = async (id, priceShipping) => {
	let order = await dbOrder.findOne({ id });
	let total = Number(order.total) + Number(priceShipping);
	let res = await dbOrder.update(id, { total });
	return res;
};

const updatePriceWithCoupon = async id => {
	let total = 0;
	let subtotal = 0;
	let res = null;
	const order = await dbOrder.findOne({ id });
	if (order) {
		const { coupon, details } = order;
		for await (let detail of details) {
			total += Number(detail.price) * Number(detail.quantity);
			subtotal += Number(detail.price) * Number(detail.quantity);
		}

		if (coupon) {
			const { type, value } = coupon;
			if (type == "percent") {
				let temp = (Number(total) * Number(value)) / 100;
				total = total - temp;
			} else {
				total = Number(total) - Number(value);
			}
		}
		updateRes = await dbOrder.update(id, { total, subtotal });
		res = { total: updateRes.total, subtotal: updateRes.subtotal };
	}

	return res;
};

const updateStatusOrder = async (id, status) => {
	await dbOrder.update(id, { status });
	return { id, status };
};

const updateWhenDeleteOrderDetails = async (id, orderId, status) => {
	const details = await dbOrderDetail.findOne({ id });
	const order = await dbOrder.findOne({ id: orderId });

	let total = 0;
	let subtotal = 0;

	if (order && details) {
		total = Number(order.total) - Number(details.total);
		subtotal = Number(order.subtotal) - Number(details.subtotal);
		await dbOrder.update(orderId, { total, subtotal });

		if (status > 1) {
			let variantId = details.variant.id;
			let productId = details.variant.product_id;
			let quantity = Number(details.quantity);

			let product = await dbProduct.findOne({ id: productId });
			let stockProduct = Number(product.stock);

			let variant = await dbVariant.findOne({ id: variantId });
			let stockVariant = Number(variant.stock);

			stockProduct += quantity;
			stockVariant += quantity;

			await dbProduct.update(productId, { stock: stockProduct });
			await dbVariant.update(variantId, { stock: stockVariant });
		}
	}
};

const saveOrder = async order => {
	let res = await dbOrder.save(order);
	return res;
};

const saveOrderDetails = async (orderId, status, details) => {
	let result = { id: orderId, details: [], total: 0, subtotal: 0, status };
	for await (const detail of details) {
		let { price, quantity } = detail;
		detail.total = Number(price) * Number(quantity);
		detail.subtotal = Number(price) * Number(quantity);

		let saveResult = await dbOrderDetail.save({ orderId, ...detail });
		result.details.push(saveResult);
		result.total += Number(saveResult.total);
		result.subtotal += Number(saveResult.subtotal);
	}

	const updateRes = await updatePriceWithCoupon(orderId);
	if (updateRes) {
		result.total = updateRes.total;
		result.subtotal = updateRes.subtotal;
	}
	return result;
};

const saveShipping = async ship => {
	let res = await dbShipping.save(ship);
	return res;
};

const fnHandleOrderByStatus = async args => {
	let result = null;
	let statusCurrent = 1;
	let { order, status, details, facebookAccessToken } = args;

	if (order && order.id) {
		statusCurrent = await checkStatusCurrent(order.id);
	}

	switch (status) {
		case 1:
			// Tạo đơn
			if (details && details.length) {
				let variants = details.map(el => {
					return { id: el.variantId, quantity: el.quantity };
				});
				result = await checkStock(variants);
				if (!result) {
					let message = "sold out";
					return { error: { message } };
				}
			}
			result = await checkExistOrder(order);
			if (!result) {
				result = await saveOrder(order);
			}

			if (result.status > 4 || result.status == 0) {
				return { error: { message: "status invalid" } };
			}
			result = await saveOrderDetails(result.id, result.status, details);
			break;
		case 2:
			// Chốt đơn
			if (statusCurrent != status) {
				updateStock(order.id, true);
				result = updateStatusOrder(order.id, status);
			}
			break;
		case 3:
			// Xác nhận thông tin - Tạo thông tin shipping
			if (statusCurrent != status) {
				let { shippingInformation } = args;
				let shipping = { ...shippingInformation, orderId: order.id };
				updatePriceWithShipping(
					shipping.orderId,
					shipping.shippingPrice
				);
				saveShipping(shipping);
				result = updateStatusOrder(order.id, status);
			}
			break;
		case 4:
			// Chờ giao hàng
			if (statusCurrent != status) {
				result = updateStatusOrder(order.id, status);
			}
			break;
		case 5:
			sendMessageTracking(order, status, facebookAccessToken);
			// Đang giao hàng
			if (statusCurrent != status) {
				sendMessageTracking(order, status, facebookAccessToken);
				result = updateStatusOrder(order.id, status);
			}
			break;
		case 6:
			// Đã giao hàng
			if (statusCurrent != status) {
				sendMessageTracking(order, status, facebookAccessToken);
				result = updateStatusOrder(order.id, status);
			}
			break;
		case 7:
			// Trả hàng
			if (statusCurrent != status) {
				sendMessageTracking(order, status, facebookAccessToken);
				updateStock(order.id, false);
				result = updateStatusOrder(order.id, status);
			}
			break;
		case 0:
			// Huỷ đơn
			if (statusCurrent != status) {
				sendMessageTracking(order, status);
				if (statusCurrent > 1) {
					updateStock(order.id, false);
				}
				result = updateStatusOrder(order.id, status);
			}
			break;
		default:
			break;
	}
	return result;
};

const getAllByFbLivestreamId = async ctx => {
	const { user } = ctx.state;
	const { facebookLivestreamId } = ctx.params;
	let result = null;

	let cond = { userId: user.id };

	if (facebookLivestreamId) {
		cond = { ...cond, facebookLivestreamId };
	}

	result = await dbOrder.findAll(cond, null, null);

	if (result.error) {
		return FAILED(ctx, result.error);
	}

	return SUCCESS(ctx, result, "Get", nameOrder);
};

const getAllByCustomerId = async ctx => {
	const { user } = ctx.state;
	const { customerId } = ctx.params;
	let result = null;

	let cond = { userId: user.id };

	if (customerId) {
		cond = { ...cond, customerId };
	}

	result = await dbOrder.findAll(cond, null, null);

	if (result.error) {
		return FAILED(ctx, result.error);
	}

	return SUCCESS(ctx, result, "Get", nameOrder);
};

const getAllByUserId = async ctx => {
	const { user } = ctx.state;
	let result = null;

	let cond = { userId: user.id };

	result = await dbOrder.findAll(cond, null, null);

	if (result.error) {
		return FAILED(ctx, result.error);
	}

	return SUCCESS(ctx, result, "Get", nameOrder);
};

const getById = async ctx => {
	const { user } = ctx.state;
	const { id } = ctx.params;

	if (user && id) {
		let cond = { id, userId: user.id };

		let result = null;
		try {
			result = await dbOrder.findOne(cond);

			// Get Carrier info
			if (
				result.shippingInformation &&
				result.shippingInformation.length
			) {
				let carrierId = result.shippingInformation[0].carrier_id;
				let carrier = await dbCarrier.findOne({ id: carrierId });
				if (carrier && !carrier.error) {
					result.carrier = carrier;
				}
			}
			// Not found
			if (result.error) {
				return NOTFOUND(ctx, nameOrder);
			}
		} catch (error) {
			return FAILED(ctx, error);
		}

		return SUCCESS(ctx, result, "Get", nameOrder);
	}
};

const create = async ctx => {
	const { user } = ctx.state;
	const { body } = ctx.request;
	let { details } = body;
	let order = _.omit(body, ["details"]);

	if (user && order) {
		order = { ...order, userId: user.id };
		const newOrder = await fnHandleOrderByStatus({
			status: 1,
			order,
			details
		});
		if (newOrder.error) {
			return FAILED(ctx, newOrder.error);
		}
		return SUCCESS(ctx, newOrder, "Create", nameOrder);
	}
};

const update = async ctx => {
	const { user } = ctx.state;
	const { body } = ctx.request;

	if (user && body) {
		try {
			const order = await fnHandleOrderByStatus(body);
			return SUCCESS(ctx, order, "Update", nameOrder);
		} catch (error) {
			return FAILED(ctx, error);
		}
	}
};

const cancel = async ctx => {
	const { user } = ctx.state;
	const { body } = ctx.request;

	if (user && body) {
		try {
			let params = body;
			params.status = 0;
			const order = await fnHandleOrderByStatus(params);
			return SUCCESS(ctx, order, "Cancel", nameOrder);
		} catch (error) {
			return FAILED(ctx, error);
		}
	}
};

const destroy = async ctx => {
	// Delete order, order details refer and some info about stock of product, variant, ...
	const { user } = ctx.state;
	const { body } = ctx.request;

	if (user && body) {
		const { ids } = body;

		let result = null;
		try {
			result = await dbOrder.destroy(ids);
			// Not found
			if (result.error) {
				return NOTFOUND(ctx, nameOrder);
			}
		} catch (error) {
			return FAILED(ctx, error);
		}

		return SUCCESS(ctx, result, "Destroyed", nameOrder);
	}
};

const destroyDetails = async ctx => {
	const { user } = ctx.state;
	const { body } = ctx.request;

	if (user && body) {
		const { ids, orderId, status } = body;

		let result = null;
		try {
			// Update Order, Stock variant, product and total, subtotal
			for await (let id of ids) {
				await updateWhenDeleteOrderDetails(id, orderId, status);
			}

			// Delete details
			result = await dbOrderDetail.hardDelete(ids);
			if (result.error) {
				return NOTFOUND(ctx, nameOrderDetail);
			}
		} catch (error) {
			return FAILED(ctx, error);
		}

		return SUCCESS(ctx, result, "Destroyed", nameOrderDetail);
	}
};

module.exports = {
	attach(router) {
		router.get("/orders", ctx =>
			protectedRoute("user", getAllByUserId, ctx)
		);
		router.get("/orders/:id", ctx => protectedRoute("user", getById, ctx));
		router.get("/orders/customer/:customerId", ctx =>
			protectedRoute("user", getAllByCustomerId, ctx)
		);
		router.get("/orders/livestream/:facebookLivestreamId", ctx =>
			protectedRoute("user", getAllByFbLivestreamId, ctx)
		);
		router.post("/orders/create", ctx =>
			protectedRoute("user", create, ctx)
		);
		router.post("/orders/update", ctx =>
			protectedRoute("user", update, ctx)
		);
		router.post("/orders/cancel", ctx =>
			protectedRoute("user", cancel, ctx)
		);
		router.delete("/orders", ctx => protectedRoute("user", destroy, ctx));
		router.delete("/orders/details", ctx =>
			protectedRoute("user", destroyDetails, ctx)
		);
	}
};
