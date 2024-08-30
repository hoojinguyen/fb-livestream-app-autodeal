const db = require("../db");
const { protectedRoute, responses } = require("./context");
const { SUCCESS, FAILED, NOTFOUND } = responses();

const dbUnit = db.Unit;
const nameUnit = "Unit";

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

		const result = await dbUnit.findAll(cond, sort, paging);

		if (result.error) {
			return FAILED(ctx, result.error);
		}

		return SUCCESS(ctx, result, "Get", nameUnit);
	}
};

const getById = async (ctx) => {
	const { user } = ctx.state;
	const { id } = ctx.params;

	if (user && id) {
		cond = { id, userId: user.id };

		let result = null;
		try {
			result = await dbUnit.findOne(cond);
			// Not found
			if (result.error) {
				return NOTFOUND(ctx, nameUnit);
			}
		} catch (error) {
			return FAILED(ctx, error);
		}

		return SUCCESS(ctx, result, "Get", nameUnit);
	}
};

const create = async (ctx) => {
	const { user } = ctx.state;
	const { body } = ctx.request;

	if (user && body) {
		const params = { userId: user.id, ...body };

		const result = await dbUnit.save(params);
		if (result.error) {
			return FAILED(ctx, result.error);
		}

		return SUCCESS(ctx, result, "Create", nameUnit);
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
			result = await dbUnit.update(id, params);
			// Not found
			if (result.error) {
				return NOTFOUND(ctx, nameUnit);
			}
		} catch (error) {
			return FAILED(ctx, error);
		}

		return SUCCESS(ctx, result, "Update", nameUnit);
	}
};

const destroy = async (ctx) => {
	const { user } = ctx.state;
	const { body } = ctx.request;

	if (user && body) {
		const { ids } = body;

		let result = null;
		try {
			result = await dbUnit.destroy(ids);
			// Not found
			if (result.error) {
				return NOTFOUND(ctx, nameUnit);
			}
		} catch (error) {
			return FAILED(ctx, error);
		}

		return SUCCESS(ctx, result, "Destroyed", nameUnit);
	}
};

const hardDelete = async (ctx) => {
	const { user } = ctx.state;
	const { body } = ctx.request;

	if (user && body) {
		const { ids } = body;

		let result = null;
		try {
			result = await dbUnit.hardDelete(ids);
			// Not found
			if (result.error) {
				return NOTFOUND(ctx, nameUnit);
			}
		} catch (error) {
			return FAILED(ctx, error);
		}

		return SUCCESS(ctx, result, "Destroyed", nameUnit);
	}
};

module.exports = {
	attach(router) {
		router.get("/units", (ctx) => protectedRoute("user", getAll, ctx));
		router.get("/units/:id", (ctx) => protectedRoute("user", getById, ctx));
		router.post("/units", (ctx) => protectedRoute("user", create, ctx));
		router.put("/units", (ctx) => protectedRoute("user", update, ctx));
		router.delete("/units", (ctx) => protectedRoute("user", destroy, ctx));
		router.delete("/units/hard", (ctx) =>
			protectedRoute("admin", hardDelete, ctx)
		);
	},
};
