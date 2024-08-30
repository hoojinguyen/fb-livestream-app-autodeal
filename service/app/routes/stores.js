const db = require("../db");
const _ = require("lodash");
const { protectedRoute, responses } = require("./context");
const { SUCCESS, FAILED, NOTFOUND } = responses();

const dbStore = db.Store;
const nameStore = "Store";

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

		const result = await dbStore.findAll(cond, sort, paging);

		if (result.error) {
			return FAILED(ctx, result.error);
		}

		return SUCCESS(ctx, result, "Get", nameStore);
	}
};

const getById = async (ctx) => {
	const { user } = ctx.state;
	const { id } = ctx.params;

	if (user && id) {
		cond = { id, userId: user.id };

		let result = null;
		try {
			result = await dbStore.findOne(cond);
			// Not found
			if (result.error) {
				return NOTFOUND(ctx, nameStore);
			}
		} catch (error) {
			return FAILED(ctx, error);
		}

		return SUCCESS(ctx, result, "Get", nameStore);
	}
};

const getByUserId = async (ctx) => {
	const { user } = ctx.state;

	if (user) {
		cond = { userId: user.id };

		let result = null;
		try {
			result = await dbStore.findOne(cond);
			// Not found
			if (result.error) {
				return NOTFOUND(ctx, nameStore);
			}
		} catch (error) {
			return FAILED(ctx, error);
		}

		if (result) {
			result = _.omit(result, ["created_at", "updated_at", "is_deleted"]);
		}

		return SUCCESS(ctx, result, "Get", nameStore);
	}
};

const create = async (ctx) => {
	const { user } = ctx.state;
	const { body } = ctx.request;

	if (user && body) {
		const params = { userId: user.id, ...body };

		const result = await dbStore.save(params);
		if (result.error) {
			return FAILED(ctx, result.error);
		}

		return SUCCESS(ctx, result, "Create", nameStore);
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
			result = await dbStore.update(id, params);
			// Not found
			if (result.error) {
				return NOTFOUND(ctx, nameStore);
			}
		} catch (error) {
			return FAILED(ctx, error);
		}

		return SUCCESS(ctx, result, "Update", nameStore);
	}
};

const destroy = async (ctx) => {
	const { user } = ctx.state;
	const { body } = ctx.request;

	if (user && body) {
		const { ids } = body;

		let result = null;
		try {
			result = await dbStore.destroy(ids);
			// Not found
			if (result.error) {
				return NOTFOUND(ctx, nameStore);
			}
		} catch (error) {
			return FAILED(ctx, error);
		}

		return SUCCESS(ctx, result, "Destroyed", nameStore);
	}
};

const hardDelete = async (ctx) => {
	const { user } = ctx.state;
	const { body } = ctx.request;

	if (user && body) {
		const { ids } = body;

		let result = null;
		try {
			result = await dbStore.hardDelete(ids);
			// Not found
			if (result.error) {
				return NOTFOUND(ctx, nameStore);
			}
		} catch (error) {
			return FAILED(ctx, error);
		}

		return SUCCESS(ctx, result, "Destroyed", nameStore);
	}
};

module.exports = {
	attach(router) {
		router.get("/stores", (ctx) => protectedRoute("user", getAll, ctx));
		router.get("/stores/:id", (ctx) =>
			protectedRoute("user", getById, ctx)
		);
		router.get("/stores/user/:id", (ctx) =>
			protectedRoute("user", getByUserId, ctx)
		);
		router.post("/stores", (ctx) => protectedRoute("user", create, ctx));
		router.put("/stores", (ctx) => protectedRoute("user", update, ctx));
		router.delete("/stores", (ctx) => protectedRoute("user", destroy, ctx));
		router.delete("/stores/hard", (ctx) =>
			protectedRoute("admin", hardDelete, ctx)
		);
	},
};
