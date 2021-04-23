const db = require("../db");
const _ = require("lodash");
const { protectedRoute, responses } = require("./context");
const { SUCCESS, FAILED, NOTFOUND } = responses();

const dbUser = db.User;
const nameUser = "User";

const getAll = async ctx => {
	let cond = null;
	let paging = null;
	let sort = null;
	const { page, size, sortBy, sortDirection } = ctx.query;
	const { user } = ctx.state;

	if (user) {
		cond = { role: "user" };
		// Sort
		if (sortBy && sortDirection) {
			sort = { sortBy, sortDirection };
		}

		// Pagination
		if (page && size) {
			paging = { page, size };
		}

		const result = await dbUser.findAll(cond, sort, paging);

		if (result.error) {
			return FAILED(ctx, result.error);
		}

		return SUCCESS(ctx, result, "Get", nameUser);
	}
};

const getById = async ctx => {
	const { user } = ctx.state;

	if (user) {
		cond = { id: user.id, role: "user" };

		let result = null;
		try {
			result = await dbUser.findOne(cond);
			// Not found
			if (result.error) {
				return NOTFOUND(ctx, nameUser);
			}
		} catch (error) {
			return FAILED(ctx, error);
		}

		if (result) {
			result = _.omit(result, [
				"password",
				"role",
				"access_token",
				"id",
				"created_at",
				"updated_at",
				"is_deleted"
			]);
		}

		return SUCCESS(ctx, result, "Get", nameUser);
	}
};

const update = async ctx => {
	const { user } = ctx.state;
	const { body } = ctx.request;

	if (user && body) {
		const { id } = user;

		let result = null;
		try {
			result = await dbUser.update(id, body);
			// Not found
			if (result.error) {
				return NOTFOUND(ctx, nameUser);
			}
		} catch (error) {
			return FAILED(ctx, error);
		}

		return SUCCESS(ctx, result, "Update", nameUser);
	}
};

const destroy = async ctx => {
	const { user } = ctx.state;
	const { body } = ctx.request;

	if (user && body) {
		const { ids } = body;

		let result = null;
		try {
			result = await dbUser.destroy(ids);
			// Not found
			if (result.error) {
				return NOTFOUND(ctx, nameUser);
			}
		} catch (error) {
			return FAILED(ctx, error);
		}

		return SUCCESS(ctx, result, "Destroyed", nameUser);
	}
};

const hardDelete = async ctx => {
	const { user } = ctx.state;
	const { body } = ctx.request;

	if (user && body) {
		const { ids } = body;

		let result = null;
		try {
			result = await dbUser.hardDelete(ids);
			// Not found
			if (result.error) {
				return NOTFOUND(ctx, nameUser);
			}
		} catch (error) {
			return FAILED(ctx, error);
		}

		return SUCCESS(ctx, result, "Destroyed", nameUser);
	}
};

const welcome = ctx => {
	ctx.body = "Welcome to FLAD API";
	ctx.status = 200;
};

const lockUser = async ctx => {
	const { body } = ctx.request;
	if (body) {
		let result = null;
		try {
			result = await dbUser.update(body.id, { isLocked: true });
			// Not found
			if (result.error) {
				return NOTFOUND(ctx, nameUser);
			}
		} catch (error) {
			return FAILED(ctx, error);
		}

		return SUCCESS(ctx, result, "Update", nameUser);
	}
};

const unlockUser = async ctx => {
	const { body } = ctx.request;
	if (body) {
		let result = null;
		try {
			result = await dbUser.update(body.id, { isLocked: false });
			// Not found
			if (result.error) {
				return NOTFOUND(ctx, nameUser);
			}
		} catch (error) {
			return FAILED(ctx, error);
		}

		return SUCCESS(ctx, result, "Update", nameUser);
	}
};

module.exports = {
	attach(router) {
		router.get("/", welcome);
		router.get("/users", ctx => protectedRoute("admin", getAll, ctx));
		router.get("/users/id", ctx => protectedRoute("user", getById, ctx));
		router.post("/lock/users", ctx =>
			protectedRoute("admin", lockUser, ctx)
		);
		router.post("/unlock/users", ctx =>
			protectedRoute("admin", unlockUser, ctx)
		);
		router.put("/users", ctx => protectedRoute("user", update, ctx));
		router.delete("/users", ctx => protectedRoute("admin", destroy, ctx));
		router.delete("/users/hard", ctx =>
			protectedRoute("admin", hardDelete, ctx)
		);
	}
};

// INSERT INTO users(name, email, phone, password, role)
// VALUES ('admin', 'admin@gmail.com', '0988882123', '$2a$10$YUhv9/q8w5m1hCk1KHTcve3j/.3w1qQAIor64yC25qVnuoTDFeua6', 'admin');
