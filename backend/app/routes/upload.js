const s3 = require("../lib/s3");
const { protectedRoute, responses } = require("./context");
const { SUCCESS, FAILED } = responses();

const uploadSingleFile = async (ctx) => {
	const { fileName, folder } = ctx.request.body;
	const signed = await s3.uploads.createSingleSignedUpload(fileName, folder);
	if (!signed) {
		return FAILED(ctx, { messageL: "Upload Failed" });
	}

	return SUCCESS(ctx, signed, "Upload", "File");
};

const uploadMultipleFile = async (ctx) => {
	const { fileNames, folder } = ctx.request.body;
	const signedArr = await s3.uploads.createMultipleSignedUpload(
		fileNames,
		folder
	);
	if (!signedArr || !signedArr.length) {
		return FAILED(ctx, { messageL: "Upload Failed" });
	}

	return SUCCESS(ctx, signedArr, "Upload", "Files");
};

module.exports = {
	attach(router) {
		router.post("/upload/single", (ctx) =>
			protectedRoute("user", uploadSingleFile, ctx)
		);
		router.post("/upload/multiple", (ctx) =>
			protectedRoute("user", uploadMultipleFile, ctx)
		);
	},
};
