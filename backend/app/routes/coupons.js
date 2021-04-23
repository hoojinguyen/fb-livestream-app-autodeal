const db = require("../db");
const { protectedRoute, responses } = require("./context");
const { SUCCESS, FAILED, NOTFOUND } = responses();

const dbCoupon = db.Coupon;
const nameCoupon = "Coupon";

const getAll = async (ctx) => {
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

		const result = await dbCoupon.findAll(cond, sort, paging);

		if (result.error) {
			return FAILED(ctx, result.error);
		}

		return SUCCESS(ctx, result, "Get", nameCoupon);
	}
};

const getById = async (ctx) => {
	const { user } = ctx.state;
	const { id } = ctx.params;

	if (user && id) {
		cond = { id, userId: user.id };

		let result = null;
		try {
			result = await dbCoupon.findOne(cond);
			// Not found
			if (result.error) {
				return NOTFOUND(ctx, nameCoupon);
			}
		} catch (error) {
			return FAILED(ctx, error);
		}

		return SUCCESS(ctx, result, "Get", nameCoupon);
	}
};

const create = async (ctx) => {
	const { user } = ctx.state;
	const { body } = ctx.request;

	if (user && body) {
		const params = { userId: user.id, ...body };

		const result = await dbCoupon.save(params);
		if (result.error) {
			return FAILED(ctx, result.error);
		}

		return SUCCESS(ctx, result, "Create", nameCoupon);
	}
};

const update = async (ctx) => {
	const { user } = ctx.state;
	const { body } = ctx.request;

	if (user && body) {
		const { id } = body;
		const params = { userId: user.id, ...body };

		let result = null;
		try {
			result = await dbCoupon.update(id, params);
			// Not found
			if (result.error) {
				return NOTFOUND(ctx, nameCoupon);
			}
		} catch (error) {
			return FAILED(ctx, error);
		}

		return SUCCESS(ctx, result, "Update", nameCoupon);
	}
};

const destroy = async (ctx) => {
	const { user } = ctx.state;
	const { body } = ctx.request;

	if (user && body) {
		const { ids } = body;

		let result = null;
		try {
			result = await dbCoupon.destroy(ids);
			// Not found
			if (result.error) {
				return NOTFOUND(ctx, nameCoupon);
			}
		} catch (error) {
			return FAILED(ctx, error);
		}

		return SUCCESS(ctx, result, "Destroyed", nameCoupon);
	}
};

const hardDelete = async (ctx) => {
	const { user } = ctx.state;
	const { body } = ctx.request;

	if (user && body) {
		const { ids } = body;

		let result = null;
		try {
			result = await dbCoupon.hardDelete(ids);
			// Not found
			if (result.error) {
				return NOTFOUND(ctx, nameCoupon);
			}
		} catch (error) {
			return FAILED(ctx, error);
		}

		return SUCCESS(ctx, result, "Destroyed", nameCoupon);
	}
};

module.exports = {
	attach(router) {
		router.get("/coupons", (ctx) => protectedRoute("user", getAll, ctx));
		router.get("/coupons/:id", (ctx) =>
			protectedRoute("user", getById, ctx)
		);
		router.post("/coupons", (ctx) => protectedRoute("user", create, ctx));
		router.put("/coupons", (ctx) => protectedRoute("user", update, ctx));
		router.delete("/coupons", (ctx) =>
			protectedRoute("user", destroy, ctx)
		);
		router.delete("/coupons/hard", (ctx) =>
			protectedRoute("admin", hardDelete, ctx)
		);
	},
};
