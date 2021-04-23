const db = require("../db");
const { protectedRoute, responses } = require("./context");
const { SUCCESS, FAILED, NOTFOUND } = responses();

const dbComment = db.CommentSample;
const nameComment = "Comment Sample";

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

		const result = await dbComment.findAll(cond, sort, paging);

		if (result.error) {
			return FAILED(ctx, result.error);
		}

		return SUCCESS(ctx, result, "Get", nameComment);
	}
};

const getById = async (ctx) => {
	const { user } = ctx.state;
	const { id } = ctx.params;

	if (user && id) {
		cond = { id, userId: user.id };

		let result = null;
		try {
			result = await dbComment.findOne(cond);
			// Not found
			if (result.error) {
				return NOTFOUND(ctx, nameComment);
			}
		} catch (error) {
			return FAILED(ctx, error);
		}

		return SUCCESS(ctx, result, "Get", nameComment);
	}
};

const create = async (ctx) => {
	const { user } = ctx.state;
	const { body } = ctx.request;

	if (user && body) {
		const params = { userId: user.id, ...body };

		const result = await dbComment.save(params);
		if (result.error) {
			return FAILED(ctx, result.error);
		}

		return SUCCESS(ctx, result, "Create", nameComment);
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
			result = await dbComment.update(id, params);
			// Not found
			if (result.error) {
				return NOTFOUND(ctx, nameComment);
			}
		} catch (error) {
			return FAILED(ctx, error);
		}

		return SUCCESS(ctx, result, "Update", nameComment);
	}
};

const destroy = async (ctx) => {
	const { user } = ctx.state;
	const { body } = ctx.request;

	if (user && body) {
		const { ids } = body;

		let result = null;
		try {
			result = await dbComment.destroy(ids);
			// Not found
			if (result.error) {
				return NOTFOUND(ctx, nameComment);
			}
		} catch (error) {
			return FAILED(ctx, error);
		}

		return SUCCESS(ctx, result, "Destroyed", nameComment);
	}
};

const hardDelete = async (ctx) => {
	const { user } = ctx.state;
	const { body } = ctx.request;

	if (user && body) {
		const { ids } = body;

		let result = null;
		try {
			result = await dbComment.hardDelete(ids);
			// Not found
			if (result.error) {
				return NOTFOUND(ctx, nameComment);
			}
		} catch (error) {
			return FAILED(ctx, error);
		}

		return SUCCESS(ctx, result, "Destroyed", nameComment);
	}
};

module.exports = {
	attach(router) {
		router.get("/comments", (ctx) => protectedRoute("user", getAll, ctx));
		router.get("/comments/:id", (ctx) =>
			protectedRoute("user", getById, ctx)
		);
		router.post("/comments", (ctx) => protectedRoute("user", create, ctx));
		router.put("/comments", (ctx) => protectedRoute("user", update, ctx));
		router.delete("/comments", (ctx) =>
			protectedRoute("user", destroy, ctx)
		);
		router.delete("/comments/hard", (ctx) =>
			protectedRoute("admin", hardDelete, ctx)
		);
	},
};
