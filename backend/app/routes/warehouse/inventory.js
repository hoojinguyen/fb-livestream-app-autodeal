const _ = require("lodash");
const db = require("../../db");

const { protectedRoute, responses } = require("../context");
const { SUCCESS, FAILED, NOTFOUND } = responses();

const dbImportReceipt = db.ImportReceipt;
const dbExportReceipt = db.ExportReceipt;
// const dbImportDetails = db.ImportReceiptDetail;
// const dbExportDetails = db.ExportReceiptDetail;

const dbProduct = db.Product;
const dbOrder = db.Order;

const nameInventory = "Inventory";

// Lay ra danh sach variants Nhap Kho -> SL Nhap kho
// Tim variant nay trong Xuat Kho -> SL Xuat kho -> Khong co tra ve 0
// Tim variant nay trong order -> SL Khach dat
// Tinh ra SL Ton kho

const getStockImport = async ({ variantId, userId }) => {
	let stock = 0;
	let receipts = await dbImportReceipt.findAll({ userId });
	if (!receipts.error) {
		for await (const receipt of receipts) {
			await receipt.importReceiptDetail.map(item => {
				if (item.variant_id == variantId) {
					stock += Number(item.quantity);
				}
			});
		}
	}

	return stock;
};

const getStockExport = async ({ variantId, userId }) => {
	let stock = 0;
	let receipts = await dbExportReceipt.findAll({ userId });
	if (!receipts.error) {
		for await (const receipt of receipts) {
			await receipt.exportReceiptDetail.map(item => {
				if (item.variant_id == variantId) {
					stock += Number(item.quantity);
				}
			});
		}
	}
	return stock;
};

const getStockOrder = async ({ variantId, userId }) => {
	let stock = 0;
	let orders = await dbOrder.findAll({ userId });
	if (!orders.error) {
		for await (const order of orders) {
			await order.details.map(item => {
				if (item.variant_id == variantId) {
					stock += Number(item.quantity);
				}
			});
		}
	}
	return stock;
};
const getAll = async ctx => {
	const { user } = ctx.state;
	let variants = [];
	let products = [];

	if (user) {
		products = await dbProduct.findAll({ userId: user.id }, null, null);
		if (products.error) {
			return FAILED(ctx, products.error);
		}

		if (products.length) {
			for await (const product of products) {
				if (product.variants.length) {
					await Promise.all(
						product.variants.map(async el => {
							let cond = { variantId: el.id, userId: user.id };
							variants.push({
								...el,
								category: product.category,
								unit: product.unit,
								stockImport: await getStockImport(cond),
								stockExport: await getStockExport(cond),
								stockOrder: await getStockOrder(cond)
							});
						})
					);
				}
			}
		}

		return SUCCESS(ctx, variants, "Get", nameInventory);
	}
};

module.exports = {
	attach(router) {
		router.get("/warehouse/inventory", ctx =>
			protectedRoute("user", getAll, ctx)
		);
	}
};
