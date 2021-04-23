const db = require("../db");
const { protectedRoute, responses } = require("./context");
const { SUCCESS, FAILED, NOTFOUND } = responses();

const dbShipping = db.ShippingInformation;
const dbOrder = db.Order;
const nameShipping = "Shipping Information";

const getAll = async ctx => {
	let cond = null;
	let paging = null;
	let sort = null;
	const { page, size, sortBy, sortDirection } = ctx.query;
	const { user } = ctx.state;

	if (user) {
		// Sort
		if (sortBy && sortDirection) {
			sort = { sortBy, sortDirection };
		}

		// Pagination
		if (page && size) {
			paging = { page, size };
		}

		const result = await dbShipping.findAll(cond, sort, paging);

		if (result.error) {
			return FAILED(ctx, result.error);
		}

		return SUCCESS(ctx, result, "Get", nameShipping);
	}
};

const getById = async ctx => {
	const { user } = ctx.state;
	const { id } = ctx.params;

	if (user && id) {
		cond = { id };

		let result = null;
		try {
			result = await dbShipping.findOne(cond);
			// Not found
			if (result.error) {
				return NOTFOUND(ctx, nameShipping);
			}
		} catch (error) {
			return FAILED(ctx, error);
		}

		return SUCCESS(ctx, result, "Get", nameShipping);
	}
};

const create = async ctx => {
	const { user } = ctx.state;
	const { body } = ctx.request;

	if (user && body) {
		const params = { ...body };

		const result = await dbShipping.save(params);
		if (result.error) {
			return FAILED(ctx, result.error);
		}

		return SUCCESS(ctx, result, "Create", nameShipping);
	}
};

const updatePriceTotalOrder = async ({ id, orderId, shippingPrice }) => {
	let shipping = await dbShipping.findOne({ id });
	let priceOld = Number(shipping.shipping_price);
	if (priceOld != Number(shippingPrice)) {
		let order = await dbOrder.findOne({ id: orderId });
		let total = Number(order.total) - priceOld;
		total += Number(shippingPrice);
		await dbOrder.update(orderId, { total });
	}
	return;
};

const update = async ctx => {
	const { user } = ctx.state;
	const { body } = ctx.request;

	if (user && body) {
		const { id } = body;
		const params = { ...body };

		let result = null;
		try {
			await updatePriceTotalOrder(params);

			result = await dbShipping.update(id, params);
			// Not found
			if (result.error) {
				return NOTFOUND(ctx, nameShipping);
			}
		} catch (error) {
			return FAILED(ctx, error);
		}

		return SUCCESS(ctx, result, "Update", nameShipping);
	}
};

const destroy = async ctx => {
	const { user } = ctx.state;
	const { body } = ctx.request;

	if (user && body) {
		const { ids } = body;

		let result = null;
		try {
			result = await dbShipping.destroy(ids);
			// Not found
			if (result.error) {
				return NOTFOUND(ctx, nameShipping);
			}
		} catch (error) {
			return FAILED(ctx, error);
		}

		return SUCCESS(ctx, result, "Destroyed", nameShipping);
	}
};

const hardDelete = async ctx => {
	const { user } = ctx.state;
	const { body } = ctx.request;

	if (user && body) {
		const { ids } = body;

		let result = null;
		try {
			result = await dbShipping.hardDelete(ids);
			// Not found
			if (result.error) {
				return NOTFOUND(ctx, nameShipping);
			}
		} catch (error) {
			return FAILED(ctx, error);
		}

		return SUCCESS(ctx, result, "Destroyed", nameShipping);
	}
};

module.exports = {
	attach(router) {
		router.get("/shippings", ctx => protectedRoute("user", getAll, ctx));
		router.get("/shippings/:id", ctx =>
			protectedRoute("user", getById, ctx)
		);
		router.post("/shippings", ctx => protectedRoute("user", create, ctx));
		router.put("/shippings", ctx => protectedRoute("user", update, ctx));
		router.delete("/shippings", ctx =>
			protectedRoute("user", destroy, ctx)
		);
		router.delete("/shippings/hard", ctx =>
			protectedRoute("admin", hardDelete, ctx)
		);
	}
};
