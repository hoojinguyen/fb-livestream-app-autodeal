module.exports = {
	Product: {
		omits: ["category_id", "unit_id", "user_id"],
		tables: ["variants", "category", "unit"]
	},
	Variant: {
		omits: ["user_id"],
		tables: []
	},
	ImportReceipt: {
		omits: ["user_id"],
		tables: ["importReceiptDetail"]
	},
	ImportReceiptDetail: {
		omits: ["user_id"],
		tables: ["unit", "variant"]
	},
	ExportReceipt: {
		omits: ["user_id"],
		tables: ["exportReceiptDetail"]
	},
	ExportReceiptDetail: {
		omits: ["user_id"],
		tables: ["unit", "variant"]
	},
	Category: {
		omits: ["user_id"],
		tables: []
	},
	User: {
		omits: [],
		tables: []
	},
	Order: {
		omits: ["user_id", "coupon_id"],
		// tables: ["details.variant.product"]
		tables: ["coupon", "customer", "details.variant", "shippingInformation"]
	},
	OrderDetail: {
		omits: ["variant_id"],
		tables: ["variant"]
	},
	Unit: {
		omits: ["user_id"],
		tables: []
	},
	Syntax: {
		omits: ["user_id"],
		tables: []
	},
	Carrier: {
		omits: ["user_id"],
		tables: []
	},
	CustomerBlock: {
		omits: ["user_id"],
		tables: ["customer"]
	},
	CustomerGroup: {
		omits: ["user_id"],
		tables: []
	},
	Customer: {
		omits: ["user_id"],
		tables: ["customerGroup"]
	},
	Note: {
		omits: ["user_id", "customer_id"],
		tables: []
	},
	Log: {
		omits: ["user_id"],
		tables: []
	},
	CommentSample: {
		omits: ["user_id"],
		tables: []
	},
	ShippingInformation: {
		omits: ["user_id"],
		tables: []
	},
	MessageSample: {
		omits: ["user_id"],
		tables: []
	},
	Livestream: {
		omits: ["user_id"],
		tables: []
	},
	Coupon: {
		omits: ["user_id"],
		tables: []
	},
	ProductGroup: {
		omits: ["user_id"],
		table: []
	},
	Store: {
		omits: ["user_id"],
		table: []
	}
};
