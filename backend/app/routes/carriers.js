const db = require("../db");
const { protectedRoute, responses } = require("./context");
const { SUCCESS, FAILED, NOTFOUND } = responses();

const dbCarrier = db.Carrier;
const nameCarrier = "Carrier";

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

		const result = await dbCarrier.findAll(cond, sort, paging);

		if (result.error) {
			return FAILED(ctx, result.error);
		}

		return SUCCESS(ctx, result, "Get", nameCarrier);
	}
};

const getById = async (ctx) => {
	const { user } = ctx.state;
	const { id } = ctx.params;

	if (user && id) {
		cond = { id, userId: user.id };

		let result = null;
		try {
			result = await dbCarrier.findOne(cond);
			// Not found
			if (result.error) {
				return NOTFOUND(ctx, nameCarrier);
			}
		} catch (error) {
			return FAILED(ctx, error);
		}

		return SUCCESS(ctx, result, "Get", nameCarrier);
	}
};

const create = async (ctx) => {
	const { user } = ctx.state;
	const { body } = ctx.request;

	if (user && body) {
		const params = { userId: user.id, ...body };

		const result = await dbCarrier.save(params);
		if (result.error) {
			return FAILED(ctx, result.error);
		}

		return SUCCESS(ctx, result, "Create", nameCarrier);
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
			result = await dbCarrier.update(id, params);
			// Not found
			if (result.error) {
				return NOTFOUND(ctx, nameCarrier);
			}
		} catch (error) {
			return FAILED(ctx, error);
		}

		return SUCCESS(ctx, result, "Update", nameCarrier);
	}
};

const destroy = async (ctx) => {
	const { user } = ctx.state;
	const { body } = ctx.request;

	if (user && body) {
		const { ids } = body;

		let result = null;
		try {
			result = await dbCarrier.destroy(ids);
			// Not found
			if (result.error) {
				return NOTFOUND(ctx, nameCarrier);
			}
		} catch (error) {
			return FAILED(ctx, error);
		}

		return SUCCESS(ctx, result, "Destroyed", nameCarrier);
	}
};

const hardDelete = async (ctx) => {
	const { user } = ctx.state;
	const { body } = ctx.request;

	if (user && body) {
		const { ids } = body;

		let result = null;
		try {
			result = await dbCarrier.hardDelete(ids);
			// Not found
			if (result.error) {
				return NOTFOUND(ctx, nameCarrier);
			}
		} catch (error) {
			return FAILED(ctx, error);
		}

		return SUCCESS(ctx, result, "Destroyed", nameCarrier);
	}
};

module.exports = {
	attach(router) {
		router.get("/carriers", (ctx) => protectedRoute("user", getAll, ctx));
		router.get("/carriers/:id", (ctx) =>
			protectedRoute("user", getById, ctx)
		);
		router.post("/carriers", (ctx) => protectedRoute("user", create, ctx));
		router.put("/carriers", (ctx) => protectedRoute("user", update, ctx));
		router.delete("/carriers", (ctx) =>
			protectedRoute("user", destroy, ctx)
		);
		router.delete("/carriers/hard", (ctx) =>
			protectedRoute("admin", hardDelete, ctx)
		);
	},
};
