const _ = require("lodash");
const db = require("../../db");

const { protectedRoute, responses } = require("../context");
const { SUCCESS, FAILED, NOTFOUND } = responses();

const dbReceiptDetail = db.ExportReceiptDetail;
const dbReceipt = db.ExportReceipt;
const dbVariant = db.Variant;
const dbProduct = db.Product;
const nameReceipt = "Receipt Export";
const nameReceiptDetails = "Receipt Export Details";

const getReceipts = async ctx => {
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
		let result = await dbReceipt.findAll(cond, sort, paging);
		if (result.error) {
			return FAILED(ctx, result.error);
		}

		return SUCCESS(ctx, result, "Get", nameReceipt);
	}
};

const getReceiptById = async ctx => {
	const { user } = ctx.state;
	const { id } = ctx.params;

	if (user && id) {
		cond = { id, userId: user.id };

		let result = null;
		try {
			result = await dbReceipt.findOne(cond);
			// Not found
			if (result.error) {
				return NOTFOUND(ctx, nameReceipt);
			}
		} catch (error) {
			return FAILED(ctx, error);
		}

		return SUCCESS(ctx, result, "Get", nameReceipt);
	}
};

const createReceipt = async ctx => {
	const { user } = ctx.state;
	const { body } = ctx.request;
	const receipt = _.omit(body, ["details"]);

	if (user && receipt) {
		let paramsReceipt = { ...receipt, userId: user.id };

		let receiptResult = await dbReceipt.save(paramsReceipt);
		if (receiptResult.error) {
			return FAILED(ctx, receiptResult.error);
		}

		return SUCCESS(ctx, receiptResult, "Create", nameReceipt);
	}
};

const updateReceipt = async ctx => {
	const { user } = ctx.state;
	const { body } = ctx.request;
	const receipt = _.omit(body, ["details"]);

	if (user && receipt) {
		const { id } = receipt;
		let paramsReceipt = { ...receipt, userId: user.id };

		let receiptResult = null;
		try {
			receiptResult = await dbReceipt.update(id, paramsReceipt);
			// Not found
			if (!receiptResult) {
				return NOTFOUND(ctx, nameReceipt);
			}
		} catch (error) {
			return FAILED(ctx, error);
		}

		return SUCCESS(ctx, receiptResult, "Update", nameReceipt);
	}
};

const destroyReceipt = async ctx => {
	const { user } = ctx.state;
	const { body } = ctx.request;

	if (user && body) {
		const { ids } = body;

		let result = null;
		try {
			result = await dbReceipt.destroy(ids);
			// Not found
			if (result.error) {
				return NOTFOUND(ctx, nameReceipt);
			}
		} catch (error) {
			return FAILED(ctx, error);
		}

		return SUCCESS(ctx, result, "Destroyed", nameReceipt);
	}
};

const hardDeleteReceipt = async ctx => {
	const { user } = ctx.state;
	const { body } = ctx.request;

	if (user && body) {
		const { ids } = body;

		let result = null;
		try {
			result = await dbReceipt.hardDelete(ids);
			// Not found
			if (result.error) {
				return NOTFOUND(ctx, nameReceipt);
			}
		} catch (error) {
			return FAILED(ctx, error);
		}

		return SUCCESS(ctx, result, "Destroyed", nameReceipt);
	}
};

const getDetailsByReceiptId = async ctx => {
	const { user } = ctx.state;
	const { id } = ctx.params;

	if (user && id) {
		cond = { exportReceiptId: id };

		let result = null;
		result = await dbReceiptDetail.findAll(cond);
		if (result.error) {
			return FAILED(ctx, result.error);
		}

		return SUCCESS(ctx, result, "Get", nameReceiptDetails);
	}
};

const subStock = async ({ variantId, quantity }) => {
	const variant = await dbVariant.findOne({ id: variantId });
	if (!variant.error) {
		await dbVariant.update(variantId, { stock: variant.stock - quantity });
		const product = await dbProduct.findOne({ id: variant.productId });
		if (!product.error) {
			await dbProduct.update(variant.productId, {
				stock: product.stock - quantity
			});
		}
	}
	return;
};

const createDetails = async ctx => {
	const { user } = ctx.state;
	const { body } = ctx.request;
	const { details, id } = body;
	let result = { id, details: [] };

	if (user && details.length) {
		try {
			for await (const detail of details) {
				let saveResult = await dbReceiptDetail.save({
					exportReceiptId: id,
					...detail
				});
				await result.details.push(saveResult);
				await subStock(detail);
			}
		} catch (error) {
			return FAILED(ctx, error);
		}

		return SUCCESS(ctx, result, "Create", nameReceiptDetails);
	}
};

const updateDetails = async ctx => {
	const { user } = ctx.state;
	const { body } = ctx.request;
	const { details } = body;

	let result = { details: [] };

	if (user && details.length) {
		try {
			for await (const detail of details) {
				let id = detail.id;
				let saveResult = await dbReceiptDetail.update(id, detail);
				result.details.push(saveResult);
			}
		} catch (error) {
			return FAILED(ctx, error);
		}

		return SUCCESS(ctx, result, "Update", nameReceiptDetails);
	}
};

const destroyDetails = async ctx => {
	const { user } = ctx.state;
	const { body } = ctx.request;
	const { ids } = body;

	if (user && body && ids.length) {
		let result = null;
		try {
			result = await dbReceiptDetail.destroy(ids);
			// Not found
			if (result.error) {
				return NOTFOUND(ctx, nameReceiptDetails);
			}
		} catch (error) {
			return FAILED(ctx, error);
		}

		return SUCCESS(ctx, result, "Destroyed", nameReceiptDetails);
	}
};

const hardDestroyDetails = async ctx => {
	const { user } = ctx.state;
	const { body } = ctx.request;
	const { ids } = body;

	if (user && body && ids.length) {
		let result = null;
		try {
			result = await dbReceiptDetail.hardDelete(ids);
			// Not found
			if (result.error) {
				return NOTFOUND(ctx, nameReceiptDetails);
			}
		} catch (error) {
			return FAILED(ctx, error);
		}

		return SUCCESS(ctx, result, "Destroyed", nameReceiptDetails);
	}
};

module.exports = {
	attach(router) {
		router.get("/warehouse/export", ctx =>
			protectedRoute("user", getReceipts, ctx)
		);
		router.get("/warehouse/export/:id", ctx =>
			protectedRoute("user", getReceiptById, ctx)
		);
		router.post("/warehouse/export", ctx =>
			protectedRoute("user", createReceipt, ctx)
		);
		router.put("/warehouse/export", ctx =>
			protectedRoute("user", updateReceipt, ctx)
		);
		router.delete("/warehouse/export", ctx =>
			protectedRoute("user", destroyReceipt, ctx)
		);
		router.delete("/warehouse/export/hard", ctx =>
			protectedRoute("admin", hardDeleteReceipt, ctx)
		);
		router.get("/warehouse/export/details/:id", ctx =>
			protectedRoute("user", getDetailsByReceiptId, ctx)
		);
		router.post("/warehouse/export/details", ctx =>
			protectedRoute("user", createDetails, ctx)
		);
		router.put("/warehouse/export/details", ctx =>
			protectedRoute("user", updateDetails, ctx)
		);
		router.delete("/warehouse/export/details", ctx =>
			protectedRoute("user", destroyDetails, ctx)
		);
		router.delete("/warehouse/export/details/hard", ctx =>
			protectedRoute("user", hardDestroyDetails, ctx)
		);
	}
};
