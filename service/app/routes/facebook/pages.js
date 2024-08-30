const FaceBook = require("../../lib/facebook-api");

const { protectedRoute, responses } = require("../context");
const { SUCCESS, FAILED } = responses();

// const db = require("../../db");
// const dbUser = db.User;

const getTokenLongLive = async ctx => {
	const { accessToken } = ctx.query;
	const result = await FaceBook.getTokenLongLive(accessToken);
	if (!result.status) {
		return FAILED(ctx, result.error);
	}

	return SUCCESS(ctx, result.data, "Get", "Access token long live");
};

const getPages = async ctx => {
	const { facebookUserId, accessToken } = ctx.query;
	// const userId = ctx.state.user.id;

	// const updateUser = await dbUser.update(userId, {
	// 	facebook_user_id: facebookUserId,
	// });

	// if (!updateUser) {
	// 	return NOTFOUND(ctx, "Page");
	// }

	const result = await FaceBook.getListPage(facebookUserId, accessToken);
	if (!result.status) {
		return FAILED(ctx, result.error);
	}

	return SUCCESS(ctx, result.data, "Get", "Pages");
};

module.exports = {
	attach(router) {
		router.get("/facebook/pages", ctx =>
			protectedRoute("user", getPages, ctx)
		);
		router.get("/facebook/token", ctx =>
			protectedRoute("user", getTokenLongLive, ctx)
		);
	}
};
