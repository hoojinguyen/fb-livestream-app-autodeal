const db = require("../db");
const { protectedRoute, responses } = require("./context");
const { SUCCESS, FAILED, NOTFOUND } = responses();

const dbSyntax = db.Syntax;
const nameSyntax = "Syntax";

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

		const result = await dbSyntax.findAll(cond, sort, paging);

		if (result.error) {
			return FAILED(ctx, result.error);
		}

		return SUCCESS(ctx, result, "Get", nameSyntax);
	}
};

const getById = async (ctx) => {
	const { user } = ctx.state;
	const { id } = ctx.params;

	if (user && id) {
		cond = { id, userId: user.id };

		let result = null;
		try {
			result = await dbSyntax.findOne(cond);
			// Not found
			if (result.error) {
				return NOTFOUND(ctx, nameSyntax);
			}
		} catch (error) {
			return FAILED(ctx, error);
		}

		return SUCCESS(ctx, result, "Get", nameSyntax);
	}
};

const create = async (ctx) => {
	const { user } = ctx.state;
	const { body } = ctx.request;

	if (user && body) {
		const params = { userId: user.id, ...body };
		if (params.details) {
			params.details = JSON.stringify(params.details);
		}

		const result = await dbSyntax.save(params);
		if (result.error) {
			return FAILED(ctx, result.error);
		}

		return SUCCESS(ctx, result, "Create", nameSyntax);
	}
};

const update = async (ctx) => {
	const { user } = ctx.state;
	const { body } = ctx.request;

	if (user && body) {
		const { id } = body;
		const params = { userId: user.id, ...body };
		if (params.details) {
			params.details = JSON.stringify(params.details);
		}

		let result = null;
		try {
			result = await dbSyntax.update(id, params);
			// Not found
			if (result.error) {
				return NOTFOUND(ctx, nameSyntax);
			}
		} catch (error) {
			return FAILED(ctx, error);
		}

		return SUCCESS(ctx, result, "Update", nameSyntax);
	}
};

const destroy = async (ctx) => {
	const { user } = ctx.state;
	const { body } = ctx.request;

	if (user && body) {
		const { ids } = body;

		let result = null;
		try {
			result = await dbSyntax.destroy(ids);
			// Not found
			if (result.error) {
				return NOTFOUND(ctx, nameSyntax);
			}
		} catch (error) {
			return FAILED(ctx, error);
		}

		return SUCCESS(ctx, result, "Destroyed", nameSyntax);
	}
};

const hardDelete = async (ctx) => {
	const { user } = ctx.state;
	const { body } = ctx.request;

	if (user && body) {
		const { ids } = body;

		let result = null;
		try {
			result = await dbSyntax.hardDelete(ids);
			// Not found
			if (result.error) {
				return NOTFOUND(ctx, nameSyntax);
			}
		} catch (error) {
			return FAILED(ctx, error);
		}

		return SUCCESS(ctx, result, "Destroyed", nameSyntax);
	}
};

module.exports = {
	attach(router) {
		router.get("/syntaxes", (ctx) => protectedRoute("user", getAll, ctx));
		router.get("/syntaxes/:id", (ctx) =>
			protectedRoute("user", getById, ctx)
		);
		router.post("/syntaxes", (ctx) => protectedRoute("user", create, ctx));
		router.put("/syntaxes", (ctx) => protectedRoute("user", update, ctx));
		router.delete("/syntaxes", (ctx) =>
			protectedRoute("user", destroy, ctx)
		);
		router.delete("/syntaxes/hard", (ctx) =>
			protectedRoute("admin", hardDelete, ctx)
		);
	},
};
