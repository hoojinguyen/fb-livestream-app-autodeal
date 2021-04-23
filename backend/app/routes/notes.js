const db = require("../db");
const { protectedRoute, responses } = require("./context");
const { SUCCESS, FAILED, NOTFOUND } = responses();

const dbNote = db.Note;
const nameNote = "Note";

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

		const result = await dbNote.findAll(cond, sort, paging);

		if (result.error) {
			return FAILED(ctx, result.error);
		}

		return SUCCESS(ctx, result, "Get", nameNote);
	}
};

const getByCustomerId = async (ctx) => {
	const { user } = ctx.state;
	const { customerId } = ctx.params;

	if (user && customerId) {
		cond = { customerId, userId: user.id };

		const result = await dbNote.findAll(cond);

		if (result.error) {
			return FAILED(ctx, result.error);
		}

		return SUCCESS(ctx, result, "Get", nameNote);
	}
};

const create = async (ctx) => {
	const { user } = ctx.state;
	const { body } = ctx.request;

	if (user && body) {
		const params = { userId: user.id, ...body };

		const result = await dbNote.save(params);
		if (result.error) {
			return FAILED(ctx, result.error);
		}

		return SUCCESS(ctx, result, "Create", nameNote);
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
			result = await dbNote.update(id, params);
			// Not found
			if (result.error) {
				return NOTFOUND(ctx, nameNote);
			}
		} catch (error) {
			return FAILED(ctx, error);
		}

		return SUCCESS(ctx, result, "Update", nameNote);
	}
};

const destroy = async (ctx) => {
	const { user } = ctx.state;
	const { body } = ctx.request;

	if (user && body) {
		const { ids } = body;

		let result = null;
		try {
			result = await dbNote.destroy(ids);
			// Not found
			if (result.error) {
				return NOTFOUND(ctx, nameNote);
			}
		} catch (error) {
			return FAILED(ctx, error);
		}

		return SUCCESS(ctx, result, "Destroyed", nameNote);
	}
};

const hardDelete = async (ctx) => {
	const { user } = ctx.state;
	const { body } = ctx.request;

	if (user && body) {
		const { ids } = body;

		let result = null;
		try {
			result = await dbNote.hardDelete(ids);
			// Not found
			if (result.error) {
				return NOTFOUND(ctx, nameNote);
			}
		} catch (error) {
			return FAILED(ctx, error);
		}

		return SUCCESS(ctx, result, "Destroyed", nameNote);
	}
};

module.exports = {
	attach(router) {
		router.get("/notes", (ctx) => protectedRoute("user", getAll, ctx));
		router.get("/notes/customer/:customerId", (ctx) =>
			protectedRoute("user", getByCustomerId, ctx)
		);
		router.post("/notes", (ctx) => protectedRoute("user", create, ctx));
		router.put("/notes", (ctx) => protectedRoute("user", update, ctx));
		router.delete("/notes", (ctx) => protectedRoute("user", destroy, ctx));
		router.delete("/notes/hard", (ctx) =>
			protectedRoute("admin", hardDelete, ctx)
		);
	},
};
