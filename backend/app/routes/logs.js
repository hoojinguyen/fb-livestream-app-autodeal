const db = require("../db");
const { protectedRoute, responses } = require("./context");
const { SUCCESS, FAILED, NOTFOUND } = responses();

const dbLog = db.Log;
const nameLog = "Log";

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

		const result = await dbLog.findAll(cond, sort, paging);

		if (result.error) {
			return FAILED(ctx, result.error);
		}

		return SUCCESS(ctx, result, "Get", nameLog);
	}
};

const getById = async (ctx) => {
	const { user } = ctx.state;
	const { id } = ctx.params;

	if (user && id) {
		cond = { id, userId: user.id };

		let result = null;
		try {
			result = await dbLog.findOne(cond);
			// Not found
			if (result.error) {
				return NOTFOUND(ctx, nameLog);
			}
		} catch (error) {
			return FAILED(ctx, error);
		}

		return SUCCESS(ctx, result, "Get", nameLog);
	}
};

const create = async (ctx) => {
	const { user } = ctx.state;
	const { body } = ctx.request;

	if (user && body) {
		const params = { userId: user.id, ...body };

		const result = await dbLog.save(params);
		if (result.error) {
			return FAILED(ctx, result.error);
		}

		return SUCCESS(ctx, result, "Create", nameLog);
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
			result = await dbLog.update(id, params);
			// Not found
			if (result.error) {
				return NOTFOUND(ctx, nameLog);
			}
		} catch (error) {
			return FAILED(ctx, error);
		}

		return SUCCESS(ctx, result, "Update", nameLog);
	}
};

const destroy = async (ctx) => {
	const { user } = ctx.state;
	const { body } = ctx.request;

	if (user && body) {
		const { ids } = body;

		let result = null;
		try {
			result = await dbLog.destroy(ids);
			// Not found
			if (result.error) {
				return NOTFOUND(ctx, nameLog);
			}
		} catch (error) {
			return FAILED(ctx, error);
		}

		return SUCCESS(ctx, result, "Destroyed", nameLog);
	}
};

const hardDelete = async (ctx) => {
	const { user } = ctx.state;
	const { body } = ctx.request;

	if (user && body) {
		const { ids } = body;

		let result = null;
		try {
			result = await dbLog.hardDelete(ids);
			// Not found
			if (result.error) {
				return NOTFOUND(ctx, nameLog);
			}
		} catch (error) {
			return FAILED(ctx, error);
		}

		return SUCCESS(ctx, result, "Destroyed", nameLog);
	}
};

module.exports = {
	attach(router) {
		router.get("/logs", (ctx) => protectedRoute("user", getAll, ctx));
		router.get("/logs/:id", (ctx) => protectedRoute("user", getById, ctx));
		router.post("/logs", (ctx) => protectedRoute("user", create, ctx));
		router.put("/logs", (ctx) => protectedRoute("user", update, ctx));
		router.delete("/logs", (ctx) => protectedRoute("user", destroy, ctx));
		router.delete("/logs/hard", (ctx) =>
			protectedRoute("admin", hardDelete, ctx)
		);
	},
};
