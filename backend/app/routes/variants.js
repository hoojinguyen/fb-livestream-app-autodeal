const _ = require("lodash");
const db = require("../db");
const { protectedRoute, responses } = require("./context");
const { SUCCESS, FAILED, NOTFOUND } = responses();

const dbVariant = db.Variant;
const dbProduct = db.Product;
const nameVariant = "Variant";

const getAll = async (ctx) => {
	let cond = null;
	const { user } = ctx.state;

	if (user) {
		cond = { userId: user.id };
		let resultProduct = await dbProduct.findAll(cond, null, null);
		if (resultProduct.error) {
			return FAILED(ctx, error);
		}

		let resultVariant = await resultProduct.map((el) => el.variants);
		return SUCCESS(ctx, _.flattenDeep(resultVariant), "Get", nameVariant);
	}
};

const getByProductId = async (ctx) => {
	const { user } = ctx.state;
	const { productId } = ctx.params;

	if (user && productId) {
		cond = { productId };

		const result = await dbVariant.findAll(cond);

		if (result.error) {
			return FAILED(ctx, result.error);
		}

		return SUCCESS(ctx, result, "Get", nameVariant);
	}
};

const create = async (ctx) => {
	const { user } = ctx.state;
	const { body } = ctx.request;

	if (user && body) {
		const params = { userId: user.id, ...body };

		const result = await dbVariant.save(params);
		if (result.error) {
			return FAILED(ctx, result.error);
		}

		return SUCCESS(ctx, result, "Create", nameVariant);
	}
};

const update = async (ctx) => {
	const { user } = ctx.state;
	const { body } = ctx.request;

	if (user && body) {
		const { id } = body;
		const params = { ...body };

		let result = null;
		try {
			result = await dbVariant.update(id, params);
			// Not found
			if (result.error) {
				return NOTFOUND(ctx, nameVariant);
			}
		} catch (error) {
			return FAILED(ctx, error);
		}

		return SUCCESS(ctx, result, "Update", nameVariant);
	}
};

const destroy = async (ctx) => {
	const { user } = ctx.state;
	const { body } = ctx.request;

	if (user && body) {
		const { ids } = body;

		let result = null;
		try {
			result = await dbVariant.destroy(ids);
			// Not found
			if (result.error) {
				return NOTFOUND(ctx, nameVariant);
			}
		} catch (error) {
			return FAILED(ctx, error);
		}

		return SUCCESS(ctx, result, "Destroyed", nameVariant);
	}
};

const hardDelete = async (ctx) => {
	const { user } = ctx.state;
	const { body } = ctx.request;

	if (user && body) {
		const { ids } = body;

		let result = null;
		try {
			result = await dbVariant.hardDelete(ids);
			// Not found
			if (result.error) {
				return NOTFOUND(ctx, nameVariant);
			}
		} catch (error) {
			return FAILED(ctx, error);
		}

		return SUCCESS(ctx, result, "Destroyed", nameVariant);
	}
};

module.exports = {
	attach(router) {
		router.get("/variants", (ctx) => protectedRoute("user", getAll, ctx));
		router.get("/variants/:productId", (ctx) =>
			protectedRoute("user", getByProductId, ctx)
		);
		router.post("/variants", (ctx) => protectedRoute("user", create, ctx));
		router.put("/variants", (ctx) => protectedRoute("user", update, ctx));
		router.delete("/variants", (ctx) =>
			protectedRoute("user", destroy, ctx)
		);
		router.delete("/variants/hard", (ctx) =>
			protectedRoute("admin", hardDelete, ctx)
		);
	},
};
