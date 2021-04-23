const db = require("../db");
const { protectedRoute, responses } = require("./context");
const { SUCCESS, FAILED, NOTFOUND } = responses();

const dbCategory = db.Category;
const nameCategory = "Category";

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

		const result = await dbCategory.findAll(cond, sort, paging);
		if (result.error) {
			return FAILED(ctx, result.error);
		}

		return SUCCESS(ctx, result, "Get", nameCategory);
	}
};

const getById = async ctx => {
	const { user } = ctx.state;
	const { id } = ctx.params;

	if (user && id) {
		cond = { id, userId: user.id };

		let result = null;
		try {
			result = await dbCategory.findOne(cond);
			// Not found
			if (result.error) {
				return NOTFOUND(ctx, nameCategory);
			}
		} catch (error) {
			return FAILED(ctx, error);
		}

		return SUCCESS(ctx, result, "Get", nameCategory);
	}
};

const create = async ctx => {
	const { user } = ctx.state;
	const { body } = ctx.request;

	if (user && body) {
		const params = { userId: user.id, ...body };

		const result = await dbCategory.save(params);
		if (result.error) {
			return FAILED(ctx, result.error);
		}

		return SUCCESS(ctx, result, "Create", nameCategory);
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
			result = await dbCategory.update(id, params);
			// Not found
			if (result.error) {
				return NOTFOUND(ctx, nameCategory);
			}
		} catch (error) {
			return FAILED(ctx, error);
		}

		return SUCCESS(ctx, result, "Update", nameCategory);
	}
};

const destroy = async ctx => {
	const { user } = ctx.state;
	const { body } = ctx.request;

	if (user && body) {
		const { ids } = body;

		let result = null;
		try {
			result = await dbCategory.destroy(ids);
			// Not found
			if (result.error) {
				return NOTFOUND(ctx, nameCategory);
			}
		} catch (error) {
			return FAILED(ctx, error);
		}

		return SUCCESS(ctx, result, "Destroyed", nameCategory);
	}
};

const hardDelete = async ctx => {
	const { user } = ctx.state;
	const { body } = ctx.request;

	if (user && body) {
		const { ids } = body;

		let result = null;
		try {
			result = await dbCategory.hardDelete(ids);
			// Not found
			if (result.error) {
				return NOTFOUND(ctx, nameCategory);
			}
		} catch (error) {
			return FAILED(ctx, error);
		}

		return SUCCESS(ctx, result, "Destroyed", nameCategory);
	}
};

module.exports = {
	attach(router) {
		router.get("/categories", ctx => protectedRoute("user", getAll, ctx));
		router.get("/categories/:id", ctx =>
			protectedRoute("user", getById, ctx)
		);
		router.post("/categories", ctx => protectedRoute("user", create, ctx));
		router.put("/categories", ctx => protectedRoute("user", update, ctx));
		router.delete("/categories", ctx =>
			protectedRoute("user", destroy, ctx)
		);
		router.delete("/categories/hard", ctx =>
			protectedRoute("admin", hardDelete, ctx)
		);
	}
};
