const _ = require("lodash");
const db = require("../db");
const Relations = require("../db/relations");

const { protectedRoute, responses } = require("./context");
const { SUCCESS, FAILED, NOTFOUND } = responses();

const dbProduct = db.Product;
const productRelation = Relations["Product"];

const dbVariant = db.Variant;
const nameProduct = "Product";

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
		const result = await dbProduct.findAll(cond, sort, paging);
		if (result.error) {
			return FAILED(ctx, result.error);
		}

		return SUCCESS(ctx, result, "Get", nameProduct);
	}
};

const getAvailableProducts = async ctx => {
	const { user } = ctx.state;

	if (user) {
		const result = await dbProduct
			.getBookshelf()
			.collection()
			.where("user_id", user.id)
			.where("stock", ">", "0")
			.fetch({
				withRelated: productRelation.tables
			})
			.then(data => {
				return Promise.all(
					data
						.serialize()
						.map(el => _.omit(el, productRelation.omits))
				);
			})
			.catch(error => {
				return { error };
			});
		if (result.error) {
			return FAILED(ctx, error);
		}

		return SUCCESS(ctx, result, "Get", nameProduct);
	}
};

const getById = async ctx => {
	const { user } = ctx.state;
	const { id } = ctx.params;

	if (user && id) {
		cond = { id, userId: user.id };

		let result = null;
		try {
			result = await dbProduct.findOne(cond);
			// Not found
			if (result.error) {
				return NOTFOUND(ctx, nameProduct);
			}
		} catch (error) {
			return FAILED(ctx, error);
		}

		return SUCCESS(ctx, result, "Get", nameProduct);
	}
};

const create = async ctx => {
	const { user } = ctx.state;
	const { body } = ctx.request;
	const { variants } = body;
	const product = _.omit(body, ["variants"]);

	if (user && product) {
		let paramsProduct = { ...product, userId: user.id };

		let productResult = await dbProduct.save(paramsProduct);
		if (productResult.error) {
			return FAILED(ctx, productResult.error);
		}

		if (productResult && productResult.id && variants.length) {
			let productId = productResult.id;
			let image = productResult.image;
			let variantResult = [];
			variantResult = await Promise.all(
				variants.map(async item => {
					item.sku = `${item.sku}-${productId}`;
					let params = { productId, image, ...item };
					return await dbVariant.save(params);
				})
			);
			productResult = {
				...productResult,
				variants: variantResult
			};
		}

		return SUCCESS(ctx, productResult, "Create", nameProduct);
	}
};

const update = async ctx => {
	const { user } = ctx.state;
	const { body } = ctx.request;
	const { variants } = body;
	const product = _.omit(body, ["variants"]);

	if (user && product) {
		const { id } = product;
		let paramsProduct = { ...product, userId: user.id };

		let productResult = null;
		try {
			productResult = await dbProduct.update(id, paramsProduct);
			// Not found
			if (!productResult) {
				return NOTFOUND(ctx, nameProduct);
			}

			if (productResult && productResult.id && variants.length) {
				let variantResult = [];
				variantResult = await Promise.all(
					variants.map(async item => {
						let id = item.id;
						return await dbVariant.update(id, item);
					})
				);
				productResult = {
					...productResult,
					variants: variantResult
				};
			}
		} catch (error) {
			return FAILED(ctx, error);
		}

		return SUCCESS(ctx, productResult, "Update", nameProduct);
	}
};

const destroy = async ctx => {
	const { user } = ctx.state;
	const { body } = ctx.request;

	if (user && body) {
		const { ids } = body;

		let result = null;
		try {
			result = await dbProduct.destroy(ids);
			// Not found
			if (result.error) {
				return NOTFOUND(ctx, nameProduct);
			}
		} catch (error) {
			return FAILED(ctx, error);
		}

		return SUCCESS(ctx, result, "Destroyed", nameProduct);
	}
};

const hardDelete = async ctx => {
	const { user } = ctx.state;
	const { body } = ctx.request;

	if (user && body) {
		const { ids } = body;

		let result = null;
		try {
			result = await dbProduct.hardDelete(ids);
			// Not found
			if (result.error) {
				return NOTFOUND(ctx, nameProduct);
			}
		} catch (error) {
			return FAILED(ctx, error);
		}

		return SUCCESS(ctx, result, "Destroyed", nameProduct);
	}
};

module.exports = {
	attach(router) {
		router.get("/products", ctx => protectedRoute("user", getAll, ctx));
		router.get("/products/instock", ctx =>
			protectedRoute("user", getAvailableProducts, ctx)
		);
		router.get("/products/:id", ctx =>
			protectedRoute("user", getById, ctx)
		);
		router.post("/products", ctx => protectedRoute("user", create, ctx));
		router.put("/products", ctx => protectedRoute("user", update, ctx));
		router.delete("/products", ctx => protectedRoute("user", destroy, ctx));
		router.delete("/products/hard", ctx =>
			protectedRoute("admin", hardDelete, ctx)
		);
	}
};
