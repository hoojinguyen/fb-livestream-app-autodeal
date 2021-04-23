const FaceBook = require("../../lib/facebook-api");
const { protectedRoute, responses } = require("../context");
const { SUCCESS, FAILED, NOTFOUND } = responses();

const publishPost = async (ctx) => {
	const params = ctx.request.body;
	const result = await FaceBook.publishPost(params);

	if (!result.status) {
		return FAILED(ctx, result.error);
	}

	return SUCCESS(ctx, result.data, "Update", "Post Publish");
};

const replyAllCommentInPost = async (ctx) => {
	const params = ctx.request.body;
	const result = await FaceBook.replyAllComment(params);

	if (!result.status) {
		return FAILED(ctx, result.error);
	}

	return SUCCESS(ctx, result.data, "Comment", "Replay All");
};

const createFeedPost = async (ctx) => {
	const params = ctx.request.body;
	const result = await FaceBook.createFeedPost(params);

	if (!result.status) {
		return FAILED(ctx, result.error);
	}

	return SUCCESS(ctx, result.data, "Creat", "Post Feed");
};

const createPhotoPost = async (ctx) => {
	const params = ctx.request.body;
	const result = await FaceBook.createPhotoPost(params);

	if (!result.status) {
		return FAILED(ctx, result.error);
	}

	return SUCCESS(ctx, result.data, "Creat", "Post Photo");
};

const updatePost = async (ctx) => {
	const params = ctx.request.body;
	const result = await FaceBook.updatePost(params);

	if (!result.status) {
		return FAILED(ctx, result.error);
	}

	return SUCCESS(ctx, result.data, "Update", "Post");
};

const deletePost = async (ctx) => {
	const params = ctx.request.body;
	const result = await FaceBook.deletePost(params);

	if (!result.status) {
		return FAILED(ctx, result.error);
	}

	return SUCCESS(ctx, result.data, "Delete", "Post");
};

const getPostsPublish = async (ctx) => {
	const { pageId, accessToken } = ctx.query;
	const result = await FaceBook.getPostsPublish(pageId, accessToken);

	if (!result.status) {
		return FAILED(ctx, result.error);
	}

	return SUCCESS(ctx, result.data, "Get", "Posts Publish");
};

const getPostsScheduled = async (ctx) => {
	const { pageId, accessToken } = ctx.query;
	const result = await FaceBook.getPostsScheduled(pageId, accessToken);

	if (!result.status) {
		return FAILED(ctx, result.error);
	}

	return SUCCESS(ctx, result.data, "Get", "Posts Scheduled");
};

const getPostDetails = async (ctx) => {
	const { accessToken, pagePostId } = ctx.query;
	const result = await FaceBook.getPostDetails(pagePostId, accessToken);

	if (!result.status) {
		return FAILED(ctx, result.error);
	}

	return SUCCESS(ctx, result.data, "Get", "Post Detail");
};

module.exports = {
	attach(router) {
		router.post("/facebook/post/feed", (ctx) =>
			protectedRoute("user", createFeedPost, ctx)
		);
		router.post("/facebook/post/photo", (ctx) =>
			protectedRoute("user", createPhotoPost, ctx)
		);
		router.post("/facebook/post/publish", (ctx) =>
			protectedRoute("user", publishPost, ctx)
		);
		router.post("/facebook/post/comment/reply", (ctx) =>
			protectedRoute("user", replyAllCommentInPost, ctx)
		);
		router.put("/facebook/post", (ctx) =>
			protectedRoute("user", updatePost, ctx)
		);
		router.delete("/facebook/post", (ctx) =>
			protectedRoute("user", deletePost, ctx)
		);
		router.get("/facebook/posts/publish", (ctx) =>
			protectedRoute("user", getPostsPublish, ctx)
		);
		router.get("/facebook/posts/scheduled", (ctx) =>
			protectedRoute("user", getPostsScheduled, ctx)
		);
		router.get("/facebook/post", (ctx) =>
			protectedRoute("user", getPostDetails, ctx)
		);
	},
};
