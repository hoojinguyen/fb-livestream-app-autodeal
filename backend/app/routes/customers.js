const db = require("../db");
const { protectedRoute, responses } = require("./context");
const { SUCCESS, FAILED, NOTFOUND } = responses();

const dbCustomer = db.Customer;
const dbCustomerGroup = db.CustomerGroup;
const nameCustomer = "Customer";
const nameCustomerGroup = "CustomerGroup";

const getAll = async ctx => {
	let cond = null;
	let paging = null;
	let sort = null;
	const { page, size, sortBy, sortDirection } = ctx.query;
	const { user } = ctx.state;

	if (user) {
		let cond = { userId: user.id };
		// Sort
		if (sortBy && sortDirection) {
			sort = { sortBy, sortDirection };
		}

		// Pagination
		if (page && size) {
			paging = { page, size };
		}

		const result = await dbCustomer.findAll(cond, sort, paging);

		if (result.error) {
			return FAILED(ctx, result.error);
		}

		return SUCCESS(ctx, result, "Get", nameCustomer);
	}
};

const getById = async ctx => {
	const { user } = ctx.state;
	const { id } = ctx.params;

	if (user && id) {
		let cond = { id, userId: user.id };

		let result = null;
		try {
			result = await dbCustomer.findOne(cond);

			// Not found
			if (result.error) {
				return NOTFOUND(ctx, nameCustomer);
			}
		} catch (error) {
			return FAILED(ctx, error);
		}

		return SUCCESS(ctx, result, "Get", nameCustomer);
	}
};

const getByFacebookId = async ctx => {
	const { user } = ctx.state;
	const { facebookUserId } = ctx.params;

	if (user && facebookUserId) {
		let cond = { facebookUserId, userId: user.id };

		let result = null;
		try {
			result = await dbCustomer.findOne(cond);

			// Not found
			if (result.error) {
				return NOTFOUND(ctx, nameCustomer);
			}
		} catch (error) {
			return FAILED(ctx, error);
		}

		return SUCCESS(ctx, result, "Get", nameCustomer);
	}
};

const getByPhone = async ctx => {
	const { user } = ctx.state;
	const { phone } = ctx.params;

	if (user) {
		let result = null;
		try {
			result = await dbCustomer.findOne({ phone, userId: user.id });

			// Not found
			if (result.error) {
				return NOTFOUND(ctx, nameCustomer);
			}
		} catch (error) {
			return FAILED(ctx, error);
		}

		return SUCCESS(ctx, result, "Get", nameCustomer);
	}
};

const create = async ctx => {
	const { user } = ctx.state;
	const { body } = ctx.request;

	if (user && body) {
		const params = { userId: user.id, ...body };

		const result = await dbCustomer.save(params);
		if (result.error) {
			return FAILED(ctx, result.error);
		}

		return SUCCESS(ctx, result, "Create", nameCustomer);
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
			result = await dbCustomer.update(id, params);
			// Not found
			if (result.error) {
				return NOTFOUND(ctx, nameCustomer);
			}
		} catch (error) {
			return FAILED(ctx, error);
		}

		return SUCCESS(ctx, result, "Update", nameCustomer);
	}
};

const destroy = async ctx => {
	const { user } = ctx.state;
	const { body } = ctx.request;

	if (user && body) {
		const { ids } = body;

		let result = null;
		try {
			result = await dbCustomer.destroy(ids);
			// Not found
			if (result.error) {
				return NOTFOUND(ctx, nameCustomer);
			}
		} catch (error) {
			return FAILED(ctx, error);
		}

		return SUCCESS(ctx, result, "Destroyed", nameCustomer);
	}
};

const hardDelete = async ctx => {
	const { user } = ctx.state;
	const { body } = ctx.request;

	if (user && body) {
		const { ids } = body;

		let result = null;
		try {
			result = await dbCustomer.hardDelete(ids);
			// Not found
			if (result.error) {
				return NOTFOUND(ctx, nameCustomer);
			}
		} catch (error) {
			return FAILED(ctx, error);
		}

		return SUCCESS(ctx, result, "Destroyed", nameCustomer);
	}
};

module.exports = {
	attach(router) {
		router.get("/customers", ctx => protectedRoute("user", getAll, ctx));
		router.get("/customers/phone/:phone", ctx =>
			protectedRoute("user", getByPhone, ctx)
		);
		router.get("/customers/:id", ctx =>
			protectedRoute("user", getById, ctx)
		);
		router.get("/customers/facebook/:facebookUserId", ctx =>
			protectedRoute("user", getByFacebookId, ctx)
		);
		router.post("/customers", ctx => protectedRoute("user", create, ctx));
		router.put("/customers", ctx => protectedRoute("user", update, ctx));
		router.delete("/customers", ctx =>
			protectedRoute("user", destroy, ctx)
		);
		router.delete("/customers/hard", ctx =>
			protectedRoute("admin", hardDelete, ctx)
		);
	}
};
