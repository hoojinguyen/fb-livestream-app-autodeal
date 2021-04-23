const FaceBook = require("../../lib/facebook-api");
const { protectedRoute, responses } = require("../context");
const { SUCCESS, FAILED } = responses();

const getConversations = async (ctx) => {
	const { pageId, accessToken } = ctx.query;
	const result = await FaceBook.getListConversation(pageId, accessToken);

	if (!result.status) {
		return FAILED(ctx, result.error);
	}

	return SUCCESS(ctx, result.data, "Get", "Conversations");
};

module.exports = {
	attach(router) {
		router.get("/facebook/conversations", (ctx) =>
			protectedRoute("user", getConversations, ctx)
		);
	},
};
