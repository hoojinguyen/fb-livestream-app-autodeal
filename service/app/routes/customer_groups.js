const db = require("../db");
const { protectedRoute, responses } = require("./context");
const { SUCCESS, FAILED, NOTFOUND } = responses();

const dbCustomerGroup = db.CustomerGroup;
const nameCustomerGroup = "Customer Group";

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

		const result = await dbCustomerGroup.findAll(cond, sort, paging);

		if (result.error) {
			return FAILED(ctx, result.error);
		}

		return SUCCESS(ctx, result, "Get", nameCustomerGroup);
	}
};

const getById = async (ctx) => {
	const { user } = ctx.state;
	const { id } = ctx.params;

	if (user && id) {
		cond = { id, userId: user.id };

		let result = null;
		try {
			result = await dbCustomerGroup.findOne(cond);
			// Not found
			if (result.error) {
				return NOTFOUND(ctx, nameCustomerGroup);
			}
		} catch (error) {
			return FAILED(ctx, error);
		}

		return SUCCESS(ctx, result, "Get", nameCustomerGroup);
	}
};

const create = async (ctx) => {
	const { user } = ctx.state;
	const { body } = ctx.request;

	if (user && body) {
		const params = { userId: user.id, ...body };

		const result = await dbCustomerGroup.save(params);
		if (result.error) {
			return FAILED(ctx, result.error);
		}

		return SUCCESS(ctx, result, "Create", nameCustomerGroup);
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
			result = await dbCustomerGroup.update(id, params);
			// Not found
			if (result.error) {
				return NOTFOUND(ctx, nameCustomerGroup);
			}
		} catch (error) {
			return FAILED(ctx, error);
		}

		return SUCCESS(ctx, result, "Update", nameCustomerGroup);
	}
};

const destroy = async (ctx) => {
	const { user } = ctx.state;
	const { body } = ctx.request;

	if (user && body) {
		const { ids } = body;

		let result = null;
		try {
			result = await dbCustomerGroup.destroy(ids);
			// Not found
			if (result.error) {
				return NOTFOUND(ctx, nameCustomerGroup);
			}
		} catch (error) {
			return FAILED(ctx, error);
		}

		return SUCCESS(ctx, result, "Destroyed", nameCustomerGroup);
	}
};

const hardDelete = async (ctx) => {
	const { user } = ctx.state;
	const { body } = ctx.request;

	if (user && body) {
		const { ids } = body;

		let result = null;
		try {
			result = await dbCustomerGroup.hardDelete(ids);
			// Not found
			if (result.error) {
				return NOTFOUND(ctx, nameCustomerGroup);
			}
		} catch (error) {
			return FAILED(ctx, error);
		}

		return SUCCESS(ctx, result, "Destroyed", nameCustomerGroup);
	}
};

module.exports = {
	attach(router) {
		router.get("/customer/groups", (ctx) =>
			protectedRoute("user", getAll, ctx)
		);
		router.get("/customer/groups/:id", (ctx) =>
			protectedRoute("user", getById, ctx)
		);
		router.post("/customer/groups", (ctx) =>
			protectedRoute("user", create, ctx)
		);
		router.put("/customer/groups", (ctx) =>
			protectedRoute("user", update, ctx)
		);
		router.delete("/customer/groups", (ctx) =>
			protectedRoute("user", destroy, ctx)
		);
		router.delete("/customer/groups/hard", (ctx) =>
			protectedRoute("admin", hardDelete, ctx)
		);
	},
};
