const FaceBook = require("../../lib/facebook-api");
const { protectedRoute, responses } = require("../context");
const { SUCCESS, FAILED } = responses();

const getListLivestream = async (ctx) => {
	const { pageId, accessToken } = ctx.query;
	const result = await FaceBook.getListLivestream(pageId, accessToken);

	if (!result.status) {
		return FAILED(ctx, result.error);
	}

	return SUCCESS(ctx, result.data, "Get", "Video LiveStream");
};

const getLivestreamDetails = async (ctx) => {
	const { accessToken } = ctx.query;
	const { livestreamId } = ctx.params;

	const result = await FaceBook.getLivestreamDetails(
		livestreamId,
		accessToken
	);

	if (!result.status) {
		return FAILED(ctx, result.error);
	}

	return SUCCESS(ctx, result.data, "Get", "Detail LiveStream");
};

const getSomeComments = async (ctx) => {
	const { accessToken, limit } = ctx.query;
	const { livestreamId } = ctx.params;

	const result = await FaceBook.getSomeCommentsLivestream(
		livestreamId,
		accessToken,
		limit
	);

	if (!result.status) {
		return FAILED(ctx, result.error);
	}

	return SUCCESS(ctx, result.data, "Get", "Comments");
};

module.exports = {
	attach(router) {
		router.get("/facebook/livestream", (ctx) =>
			protectedRoute("user", getListLivestream, ctx)
		);
		router.get("/facebook/livestream/detail/:livestreamId", (ctx) =>
			protectedRoute("user", getLivestreamDetails, ctx)
		);
		router.get("/facebook/livestream/comments/:livestreamId", (ctx) =>
			protectedRoute("user", getSomeComments, ctx)
		);
	},
};
