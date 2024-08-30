const _ = require("lodash");
const { toCamel } = require("../utils");
const db = require("../db");
const { protectedRoute, responses } = require("./context");
const { SUCCESS, FAILED, NOTFOUND, CUSTOM } = responses();

const dbOrder = db.Order;
const dbOrderDetail = db.OrderDetail;
const dbVariant = db.Variant;
const dbProduct = db.Product;
const dbShippingInformation = db.ShippingInformation;
const nameOrder = "Order";

const getAll = async ctx => {
	let cond = null;
	let paging = null;
	let sort = null;
	const { page, size, sortBy, sortDirection } = ctx.query;
	const { user } = ctx.state;

	if (user) {
		cond = { userId: user.id };
		// Sort
		if (sortBy && sortDirection) {
			sort = { sortBy, sortDirection };
		}

		// Pagination
		if (page && size) {
			paging = { page, size };
		}

		const result = await dbOrder.findAll(cond, sort, paging);
		if (result.error) {
			return FAILED(ctx, result.error);
		}

		return SUCCESS(ctx, result, "Get", nameOrder);
	}
};

const getById = async ctx => {
	const { user } = ctx.state;
	const { id } = ctx.params;

	if (user && id) {
		cond = { id, userId: user.id };

		let result = null;
		try {
			result = await dbOrder.findOne(cond);
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
	const { details } = body;
	const order = _.omit(body, ["details"]);

	if (user && order) {
		let checkExists = await dbOrder.findOne({
			facebookLivestreamId: order.facebookLivestreamId,
			facebookUserId: order.facebookUserId
		});

		if (!checkExists.error)
			return SUCCESS(ctx, checkExists, "Create", nameOrder);

		if (details.length) {
			const checkStock = await checkOrderInStock(details);

			if (!checkStock.status)
				return CUSTOM(ctx, 400, false, "Thieu hang", checkStock.data);
		}

		let paramsOrder = { ...order, userId: user.id };

		let orderResult = await dbOrder.save(paramsOrder);
		if (orderResult.error) {
			return FAILED(ctx, orderResult.error);
		}

		if (orderResult && orderResult.id && details.length) {
			let orderId = orderResult.id;
			let detailResult = [];
			detailResult = await Promise.all(
				details.map(async item => {
					let params = { orderId, ...item };
					return await dbOrderDetail.save(params);
				})
			);
			console.log(
				"🚀 ~ file: orders.js ~ line 101 ~ detailResult",
				detailResult
			);

			// const weight = calculateWeight(detailResult);
			// const subtotal = calculateTotalPrice(detailResult);

			orderResult = {
				...orderResult,
				// weight,
				// subtotal,
				details: detailResult
			};
		}

		return SUCCESS(ctx, orderResult, "Create", nameOrder);
	}
};

const update = async ctx => {
	const { user } = ctx.state;
	const { body } = ctx.request;

	if (user && body) {
		const { id } = body;
		const params = { userId: user.id, ...body };

		let result = null;
		try {
			result = await dbOrder.update(id, params);
			// Not found
			if (result.error) {
				return NOTFOUND(ctx, nameOrder);
			}
		} catch (error) {
			return FAILED(ctx, error);
		}

		return SUCCESS(ctx, result, "Update", nameOrder);
	}
};

const updateStatus = async ctx => {
	const { user } = ctx.state;
	const { body } = ctx.request;

	if (user && body) {
		const { id, status } = body;
		const order = await dbOrder.findOne({ id });
		if (order.status == status)
			return SUCCESS(ctx, order, "Update", nameOrder);
		switch (status) {
			// Tao don
			case 1: {
				return create(ctx);
			}
			// Chot don
			case 2: {
				const checkStock = await checkOrderInStock(
					toCamel(order.details)
				);

				if (!checkStock.status)
					return CUSTOM(
						ctx,
						400,
						false,
						"Thieu hang",
						checkStock.data
					);

				for (const detail of order.details) {
					const variant = await dbVariant.findOne({
						id: detail.variant_id
					});
					if (variant.stock >= detail.quantity) {
						const stock = variant.stock - detail.quantity;

						const result = await dbVariant.update(variant.id, {
							stock
						});

						if (result.error) return FAILED(ctx, result.error);
						console.log(result);

						const updateStock = await updateProductStock(
							result.product_id
						);
						if (updateStock.error)
							return FAILED(ctx, updateStock.error);
					}
				}

				break;
			}
			// Xac nhan thong tin
			case 3: {
				const { carrierId, price, address } = body;

				const info = {
					orderId: order.id,
					carrierId,
					price,
					address
				};

				const result = await dbShippingInformation.save(info);

				if (result.error) return FAILED(ctx, result.error);
				break;
			}
			//Cho giao hang
			case 4:
			//Dang giao hang
			case 5:
			//Da giao hang
			case 6: {
				break;
			}
			// Huy don
			case 7:
			//Tra hang
			case 8:
			// Bom hang
			case 9: {
				if (order.status != 1) {
					for (const detail of order.details) {
						const variant = await dbVariant.findOne({
							id: detail.variant_id
						});
						if (variant.stock >= detail.quantity) {
							const stock = variant.stock + detail.quantity;

							const result = await dbVariant.update(variant.id, {
								stock
							});

							if (result.error) return FAILED(ctx, result.error);

							const updateStock = await updateProductStock(
								result.product_id
							);
							if (updateStock.error)
								return FAILED(ctx, updateStock.error);
						}
					}
				}
				break;
			}
			default: {
				return FAILED(ctx, "Wrong Status !");
			}
		}
		const result = await dbOrder.update(id, { status });
		if (result.error) return FAILED(ctx, error);
		return SUCCESS(ctx, order, "Update", nameOrder);
	}
};

const destroy = async ctx => {
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

const hardDelete = async ctx => {
	const { user } = ctx.state;
	const { body } = ctx.request;

	if (user && body) {
		const { ids } = body;

		let result = null;
		try {
			result = await dbOrder.hardDelete(ids);
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

const calculateWeight = orderDetails => {
	let weight = 0;
	orderDetails.forEach(detail => {
		if (detail.variant) weight += detail.variant.product.weight;
	});
	return weight;
};

const calculateTotalPrice = orderDetails => {
	let total = 0;
	orderDetails.forEach(detail => {
		if (detail.variant)
			total += detail.variant.sell_price * detail.quantity;
	});
	return total;
};

const checkOrderInStock = async orderDetails => {
	if (orderDetails.length) {
		let variantError = [];
		await Promise.all(
			orderDetails.map(async item => {
				const variant = await dbVariant.findOne({ id: item.variantId });
				if (variant) {
					if (variant.stock < item.quantity)
						variantError.push(variant);
				}
			})
		);
		if (variantError.length) {
			return { data: variantError, status: false };
		}
		return { status: true };
	}
	return { status: true };
};

const updateProductStock = async productId => {
	if (productId) {
		const product = await dbProduct.findOne({ id: productId });
		if (product.error) return { error: product.error };
		let stock = 0;

		product.variants.forEach(variant => {
			stock += variant.stock;
		});

		const result = dbProduct.update(productId, { stock });
		if (result.error) return { error: product.error };
		return result;
	}
	return { error: "Wrong Product ID" };
};

module.exports = {
	attach(router) {
		router.get("/orders2", ctx => protectedRoute("user", getAll, ctx));
		router.post("/orders2", ctx => protectedRoute("user", create, ctx));
		router.post("/orders2/status", ctx =>
			protectedRoute("user", updateStatus, ctx)
		);
		router.put("/orders2", ctx => protectedRoute("user", update, ctx));
		router.delete("/orders2", ctx => protectedRoute("user", destroy, ctx));
		router.get("/orders2/:id", ctx => protectedRoute("user", getById, ctx));
		router.delete("/orders2/hard", ctx =>
			protectedRoute("admin", hardDelete, ctx)
		);
	}
};
