const _ = require("lodash");
const db = require("../db");
const { protectedRoute, responses } = require("./context");
const { SUCCESS, FAILED, NOTFOUND } = responses();

const dbProductGroup = db.ProductGroup;
const dbProduct = db.Product;
const nameProductGroup = "Product Group";

const getAll = async (ctx) => {
	let cond = null;
	const { user } = ctx.state;

	if (user) {
		cond = { userId: user.id };
		let result = await dbProductGroup.findAll(cond, null, null);
		if (result.error) {
			return FAILED(ctx, error);
		}

		const omitFields = ["variants", "category", "unit"];

		await Promise.all(
			result.map(async (item) => {
				item.products = [];
				await Promise.all(
					item.ids.map(async (id) => {
						let product = await dbProduct.findOne({
							id,
							userId: user.id,
						});

						if (!product.error) {
							product = _.omit(product, omitFields);
							await item.products.push(product);
						}
					})
				);
				return item;
			})
		);

		return SUCCESS(ctx, result, "Get", nameProductGroup);
	}
};

const getById = async (ctx) => {
	const { user } = ctx.state;
	const { id } = ctx.params;

	if (user && id) {
		cond = { id, userId: user.id };

		let result = await dbProductGroup.findOne(cond);
		// Not found
		if (result.error) {
			return NOTFOUND(ctx, nameProductGroup);
		}

		result.variants = [];
		for await (const id of result.ids) {
			product = await dbProduct.findOne({ id, userId: user.id });
			if (!product.error) {
				await result.variants.push(product.variants);
			}
		}

		result.variants = _.flattenDeep(result.variants);

		return SUCCESS(ctx, _.omit(result, ["ids"]), "Get", nameProductGroup);
	}
};

const create = async (ctx) => {
	const { user } = ctx.state;
	const { body } = ctx.request;

	if (user && body) {
		const params = { userId: user.id, ...body };
		if (params.ids) {
			params.ids = JSON.stringify(params.ids);
		}

		const result = await dbProductGroup.save(params);

		if (result.error) {
			return FAILED(ctx, result.error);
		}

		const omitFields = ["variants", "category", "unit"];
		result.products = [];
		await Promise.all(
			result.ids.map(async (id) => {
				let product = await dbProduct.findOne({
					id,
					userId: user.id,
				});

				if (!product.error) {
					product = _.omit(product, omitFields);
					await result.products.push(product);
				}
			})
		);

		return SUCCESS(ctx, result, "Create", nameProductGroup);
	}
};

const update = async (ctx) => {
	const { user } = ctx.state;
	const { body } = ctx.request;

	if (user && body) {
		const { id } = body;
		const params = { userId: user.id, ...body };
		if (params.ids) {
			params.ids = JSON.stringify(params.ids);
		}

		let result = null;
		try {
			result = await dbProductGroup.update(id, params);
			// Not found
			if (result.error) {
				return NOTFOUND(ctx, nameProductGroup);
			}
		} catch (error) {
			return FAILED(ctx, error);
		}

		return SUCCESS(ctx, result, "Update", nameProductGroup);
	}
};

const destroy = async (ctx) => {
	const { user } = ctx.state;
	const { body } = ctx.request;

	if (user && body) {
		const { ids } = body;

		let result = null;
		try {
			result = await dbProductGroup.destroy(ids);
			// Not found
			if (result.error) {
				return NOTFOUND(ctx, nameProductGroup);
			}
		} catch (error) {
			return FAILED(ctx, error);
		}

		return SUCCESS(ctx, result, "Destroyed", nameProductGroup);
	}
};

const hardDelete = async (ctx) => {
	const { user } = ctx.state;
	const { body } = ctx.request;

	if (user && body) {
		const { ids } = body;

		let result = null;
		try {
			result = await dbProductGroup.hardDelete(ids);
			// Not found
			if (result.error) {
				return NOTFOUND(ctx, nameProductGroup);
			}
		} catch (error) {
			return FAILED(ctx, error);
		}

		return SUCCESS(ctx, result, "Destroyed", nameProductGroup);
	}
};

module.exports = {
	attach(router) {
		router.get("/product/groups", (ctx) =>
			protectedRoute("user", getAll, ctx)
		);
		router.get("/product/groups/:id", (ctx) =>
			protectedRoute("user", getById, ctx)
		);
		router.post("/product/groups", (ctx) =>
			protectedRoute("user", create, ctx)
		);
		router.put("/product/groups", (ctx) =>
			protectedRoute("user", update, ctx)
		);
		router.delete("/product/groups", (ctx) =>
			protectedRoute("user", destroy, ctx)
		);
		router.delete("/product/groups/hard", (ctx) =>
			protectedRoute("admin", hardDelete, ctx)
		);
	},
};
