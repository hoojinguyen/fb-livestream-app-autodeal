const db = require("../db");
const { protectedRoute, responses } = require("./context");
const { SUCCESS, FAILED, NOTFOUND } = responses();

const dbLivestream = db.Livestream;
const nameLivestream = "Livestream";

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

		const result = await dbLivestream.findAll(cond, sort, paging);

		if (result.error) {
			return FAILED(ctx, result.error);
		}

		return SUCCESS(ctx, result, "Get", nameLivestream);
	}
};

const getById = async (ctx) => {
	const { user } = ctx.state;
	const { id } = ctx.params;

	if (user && id) {
		cond = { id, userId: user.id };

		let result = null;
		try {
			result = await dbLivestream.findOne(cond);
			// Not found
			if (result.error) {
				return NOTFOUND(ctx, nameLivestream);
			}
		} catch (error) {
			return FAILED(ctx, error);
		}

		return SUCCESS(ctx, result, "Get", nameLivestream);
	}
};

const getByFacebookLivestreamId = async (ctx) => {
	const { user } = ctx.state;
	const { facebookLivestreamId } = ctx.params;

	if (user && facebookLivestreamId) {
		cond = { facebookLivestreamId, userId: user.id };

		let result = null;
		try {
			result = await dbLivestream.findOne(cond);
			// Not found
			if (result.error) {
				return NOTFOUND(ctx, nameLivestream);
			}
		} catch (error) {
			return FAILED(ctx, error);
		}

		return SUCCESS(ctx, result, "Get", nameLivestream);
	}
};

const create = async (ctx) => {
	const { user } = ctx.state;
	const { body } = ctx.request;

	if (user && body) {
		const params = { userId: user.id, ...body };

		const result = await dbLivestream.save(params);
		if (result.error) {
			return FAILED(ctx, result.error);
		}

		return SUCCESS(ctx, result, "Create", nameLivestream);
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
			result = await dbLivestream.update(id, params);
			// Not found
			if (result.error) {
				return NOTFOUND(ctx, nameLivestream);
			}
		} catch (error) {
			return FAILED(ctx, error);
		}

		return SUCCESS(ctx, result, "Update", nameLivestream);
	}
};

const destroy = async (ctx) => {
	const { user } = ctx.state;
	const { body } = ctx.request;

	if (user && body) {
		const { ids } = body;

		let result = null;
		try {
			result = await dbLivestream.destroy(ids);
			// Not found
			if (result.error) {
				return NOTFOUND(ctx, nameLivestream);
			}
		} catch (error) {
			return FAILED(ctx, error);
		}

		return SUCCESS(ctx, result, "Destroyed", nameLivestream);
	}
};

const hardDelete = async (ctx) => {
	const { user } = ctx.state;
	const { body } = ctx.request;

	if (user && body) {
		const { ids } = body;

		let result = null;
		try {
			result = await dbLivestream.hardDelete(ids);
			// Not found
			if (result.error) {
				return NOTFOUND(ctx, nameLivestream);
			}
		} catch (error) {
			return FAILED(ctx, error);
		}

		return SUCCESS(ctx, result, "Destroyed", nameLivestream);
	}
};

module.exports = {
	attach(router) {
		router.get("/livestreams", (ctx) =>
			protectedRoute("user", getAll, ctx)
		);
		router.get("/livestreams/:id", (ctx) =>
			protectedRoute("user", getById, ctx)
		);
		router.get("/livestreams/facebook/:facebookLivestreamId", (ctx) =>
			protectedRoute("user", getByFacebookLivestreamId, ctx)
		);
		router.post("/livestreams", (ctx) =>
			protectedRoute("user", create, ctx)
		);
		router.put("/livestreams", (ctx) =>
			protectedRoute("user", update, ctx)
		);
		router.delete("/livestreams", (ctx) =>
			protectedRoute("user", destroy, ctx)
		);
		router.delete("/livestreams/hard", (ctx) =>
			protectedRoute("admin", hardDelete, ctx)
		);
	},
};
