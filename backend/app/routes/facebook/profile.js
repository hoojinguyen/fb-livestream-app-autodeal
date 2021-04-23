const FaceBook = require("../../lib/facebook-api");

const { protectedRoute, responses } = require("../context");
const { SUCCESS, FAILED } = responses();

const getProfile = async (ctx) => {
	const { facebookUserId, accessToken } = ctx.query;

	const result = await FaceBook.getProfile(facebookUserId, accessToken);
	if (!result.status) {
		return FAILED(ctx, result.error);
	}

	return SUCCESS(ctx, result.data, "Get", "Profile");
};

module.exports = {
	attach(router) {
		router.get("/facebook/profile", (ctx) =>
			protectedRoute("user", getProfile, ctx)
		);
	},
};
