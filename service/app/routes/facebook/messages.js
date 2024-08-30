const FaceBook = require("../../lib/facebook-api");
const { protectedRoute, responses } = require("../context");
const { SUCCESS, FAILED } = responses();

const getMessages = async (ctx) => {
	const { accessToken, conversationId, limit } = ctx.query;
	let result = null;

	if (limit) {
		result = await FaceBook.getSomeMessages(
			conversationId,
			accessToken,
			limit
		);
	} else {
		result = await FaceBook.getAllMessages(conversationId, accessToken);
	}

	if (!result.status) {
		return FAILED(ctx, result.error);
	}

	return SUCCESS(ctx, result.data, "Get", "Messages");
};

const sendMessage = async (ctx) => {
	const params = ctx.request.body;

	const result = await FaceBook.sendMessage(params);
	if (!result.status) {
		return FAILED(ctx, result.error);
	}

	return SUCCESS(ctx, result.data, "Send", "Messages");
};

module.exports = {
	attach(router) {
		router.get("/facebook/messages", (ctx) =>
			protectedRoute("user", getMessages, ctx)
		);
		router.post("/facebook/messages/send", (ctx) =>
			protectedRoute("user", sendMessage, ctx)
		);
	},
};
