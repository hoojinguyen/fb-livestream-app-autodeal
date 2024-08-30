const db = require("../db");
const { protectedRoute, responses } = require("./context");
const { SUCCESS, FAILED, NOTFOUND } = responses();

const dbCustomerBlock = db.CustomerBlock;
const nameCustomerBlock = "Customer Block";

const getAll = async ctx => {
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

		const result = await dbCustomerBlock.findAll(cond, sort, paging);

		if (result.error) {
			return FAILED(ctx, result.error);
		}

		return SUCCESS(ctx, result, "Get", nameCustomerBlock);
	}
};

const getById = async ctx => {
	const { user } = ctx.state;
	const { id } = ctx.params;

	if (user && id) {
		cond = { id, userId: user.id };

		let result = null;
		try {
			result = await dbCustomerBlock.findOne(cond);
			// Not found
			if (result.error) {
				return NOTFOUND(ctx, nameCustomerBlock);
			}
		} catch (error) {
			return FAILED(ctx, error);
		}

		return SUCCESS(ctx, result, "Get", nameCustomerBlock);
	}
};

const create = async ctx => {
	const { user } = ctx.state;
	const { body } = ctx.request;
	let result = null;

	if (user && body) {
		let checkExist = await dbCustomerBlock.findOne({
			userId: user.id,
			customerId: body.customerId
		});
		if (checkExist.error) {
			result = await dbCustomerBlock.save({
				userId: user.id,
				count: 1,
				...body
			});
			if (result.error) {
				return FAILED(ctx, result.error);
			}
		} else {
			result = await dbCustomerBlock.update(checkExist.id, {
				count: Number(checkExist.count) + 1,
				reason: body.reason
			});
			if (result.error) {
				return NOTFOUND(ctx, nameCustomerBlock);
			}
		}

		return SUCCESS(ctx, result, "Create", nameCustomerBlock);
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
			result = await dbCustomerBlock.update(id, params);
			// Not found
			if (result.error) {
				return NOTFOUND(ctx, nameCustomerBlock);
			}
		} catch (error) {
			return FAILED(ctx, error);
		}

		return SUCCESS(ctx, result, "Update", nameCustomerBlock);
	}
};

const destroy = async ctx => {
	const { user } = ctx.state;
	const { body } = ctx.request;

	if (user && body) {
		const { ids } = body;

		let result = null;
		try {
			result = await dbCustomerBlock.destroy(ids);
			// Not found
			if (result.error) {
				return NOTFOUND(ctx, nameCustomerBlock);
			}
		} catch (error) {
			return FAILED(ctx, error);
		}

		return SUCCESS(ctx, result, "Destroyed", nameCustomerBlock);
	}
};

const hardDelete = async ctx => {
	const { user } = ctx.state;
	const { body } = ctx.request;

	if (user && body) {
		const { ids } = body;

		let result = null;
		try {
			result = await dbCustomerBlock.hardDelete(ids);
			// Not found
			if (result.error) {
				return NOTFOUND(ctx, nameCustomerBlock);
			}
		} catch (error) {
			return FAILED(ctx, error);
		}

		return SUCCESS(ctx, result, "Destroyed", nameCustomerBlock);
	}
};

module.exports = {
	attach(router) {
		router.get("/block/customers", ctx =>
			protectedRoute("user", getAll, ctx)
		);
		router.get("/block/customers/:id", ctx =>
			protectedRoute("user", getById, ctx)
		);
		router.post("/block/customers", ctx =>
			protectedRoute("user", create, ctx)
		);
		router.put("/block/customers", ctx =>
			protectedRoute("user", update, ctx)
		);
		router.delete("/block/customers", ctx =>
			protectedRoute("user", destroy, ctx)
		);
		router.delete("/block/customers/hard", ctx =>
			protectedRoute("user", hardDelete, ctx)
		);
	}
};
