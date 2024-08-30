const db = require("../db");
const { protectedRoute, responses } = require("./context");
const { SUCCESS, FAILED, NOTFOUND } = responses();

const dbMessage = db.MessageSample;
const nameMessage = "Message Sample";

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

		const result = await dbMessage.findAll(cond, sort, paging);

		if (result.error) {
			return FAILED(ctx, result.error);
		}

		return SUCCESS(ctx, result, "Get", nameMessage);
	}
};

const getById = async (ctx) => {
	const { user } = ctx.state;
	const { id } = ctx.params;

	if (user && id) {
		cond = { id, userId: user.id };

		let result = null;
		try {
			result = await dbMessage.findOne(cond);
			// Not found
			if (result.error) {
				return NOTFOUND(ctx, nameMessage);
			}
		} catch (error) {
			return FAILED(ctx, error);
		}

		return SUCCESS(ctx, result, "Get", nameMessage);
	}
};

const create = async (ctx) => {
	const { user } = ctx.state;
	const { body } = ctx.request;

	if (user && body) {
		const params = { userId: user.id, ...body };

		const result = await dbMessage.save(params);
		if (result.error) {
			return FAILED(ctx, result.error);
		}

		return SUCCESS(ctx, result, "Create", nameMessage);
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
			result = await dbMessage.update(id, params);
			// Not found
			if (result.error) {
				return NOTFOUND(ctx, nameMessage);
			}
		} catch (error) {
			return FAILED(ctx, error);
		}

		return SUCCESS(ctx, result, "Update", nameMessage);
	}
};

const destroy = async (ctx) => {
	const { user } = ctx.state;
	const { body } = ctx.request;

	if (user && body) {
		const { ids } = body;

		let result = null;
		try {
			result = await dbMessage.destroy(ids);
			// Not found
			if (result.error) {
				return NOTFOUND(ctx, nameMessage);
			}
		} catch (error) {
			return FAILED(ctx, error);
		}

		return SUCCESS(ctx, result, "Destroyed", nameMessage);
	}
};

const hardDelete = async (ctx) => {
	const { user } = ctx.state;
	const { body } = ctx.request;

	if (user && body) {
		const { ids } = body;

		let result = null;
		try {
			result = await dbMessage.hardDelete(ids);
			// Not found
			if (result.error) {
				return NOTFOUND(ctx, nameMessage);
			}
		} catch (error) {
			return FAILED(ctx, error);
		}

		return SUCCESS(ctx, result, "Destroyed", nameMessage);
	}
};

module.exports = {
	attach(router) {
		router.get("/messages", (ctx) => protectedRoute("user", getAll, ctx));
		router.get("/messages/:id", (ctx) =>
			protectedRoute("user", getById, ctx)
		);
		router.post("/messages", (ctx) => protectedRoute("user", create, ctx));
		router.put("/messages", (ctx) => protectedRoute("user", update, ctx));
		router.delete("/messages", (ctx) =>
			protectedRoute("user", destroy, ctx)
		);
		router.delete("/messages/hard", (ctx) =>
			protectedRoute("admin", hardDelete, ctx)
		);
	},
};
