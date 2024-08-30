const knex = require("./knex");
const Bookshelf = require("bookshelf")(knex);

const User = Bookshelf.model("User", {
	tableName: "users",
	carriers() {
		return this.hasMany("Carrier");
	}
});

const Store = Bookshelf.model("Store", {
	tableName: "stores"
});

const Customer = Bookshelf.model("Customer", {
	tableName: "customers",
	customerGroup() {
		return this.belongsTo("CustomerGroup");
	}
});

const CustomerGroup = Bookshelf.model("CustomerGroup", {
	tableName: "customer_groups"
});

const CustomerBlock = Bookshelf.model("CustomerBlock", {
	tableName: "customer_blocks",
	customer() {
		return this.belongsTo("Customer");
	}
});

const Category = Bookshelf.model("Category", {
	tableName: "categories"
});

const Product = Bookshelf.model("Product", {
	tableName: "products",
	variants() {
		return this.hasMany("Variant");
	},
	category() {
		return this.belongsTo("Category");
	},
	unit() {
		return this.belongsTo("Unit");
	}
});

const ProductGroup = Bookshelf.model("ProductGroup", {
	tableName: "product_groups"
});

const Variant = Bookshelf.model("Variant", {
	tableName: "variants",
	product() {
		return this.belongsTo("Product");
	}
});

const Carrier = Bookshelf.model("Carrier", {
	tableName: "carriers",
	user() {
		return this.belongsTo("User");
	}
});

const Unit = Bookshelf.model("Unit", {
	tableName: "units"
});

const Coupon = Bookshelf.model("Coupon", {
	tableName: "coupons"
});

const Order = Bookshelf.model("Order", {
	tableName: "orders",
	details() {
		return this.hasMany("OrderDetail");
	},
	customer() {
		return this.belongsTo("Customer");
	},
	coupon() {
		return this.belongsTo("Coupon");
	},
	shippingInformation() {
		return this.hasMany("ShippingInformation");
	}
});

const OrderDetail = Bookshelf.model("OrderDetail", {
	tableName: "order_details",
	variant() {
		return this.belongsTo("Variant");
	}
});

const Syntax = Bookshelf.model("Syntax", {
	tableName: "syntaxes"
});

const Note = Bookshelf.model("Note", {
	tableName: "notes"
});

const Log = Bookshelf.model("Log", {
	tableName: "logs"
});

const Livestream = Bookshelf.model("Livestream", {
	tableName: "livestreams"
});

const ImportReceipt = Bookshelf.model("ImportReceipt", {
	tableName: "import_receipts",
	importReceiptDetail() {
		return this.hasMany("ImportReceiptDetail");
	}
});

const ImportReceiptDetail = Bookshelf.model("ImportReceiptDetail", {
	tableName: "import_receipt_details",
	importReceipt() {
		return this.belongsTo("ImportReceipt");
	},
	variant() {
		return this.belongsTo("Variant");
	},
	unit() {
		return this.belongsTo("Unit");
	}
});

const ExportReceipt = Bookshelf.model("ExportReceipt", {
	tableName: "export_receipts",
	exportReceiptDetail() {
		return this.hasMany("ExportReceiptDetail");
	}
});

const ExportReceiptDetail = Bookshelf.model("ExportReceiptDetail", {
	tableName: "export_receipt_details",
	exportReceipt() {
		return this.belongsTo("ExportReceipt");
	},
	variant() {
		return this.belongsTo("Variant");
	},
	unit() {
		return this.belongsTo("Unit");
	}
});

const ShippingInformation = Bookshelf.model("ShippingInformation", {
	tableName: "shipping_information"
});

const CommentSample = Bookshelf.model("CommentSample", {
	tableName: "comment_samples"
});

const MessageSample = Bookshelf.model("MessageSample", {
	tableName: "message_samples"
});

const ChatBot = Bookshelf.model("ChatBot", {
	tableName: "chatbots"
});

const Setting = Bookshelf.model("Setting", {
	tableName: "settings"
});

module.exports = {
	User,
	Store,
	Syntax,
	CustomerGroup,
	Customer,
	CustomerBlock,
	Category,
	Unit,
	Product,
	Variant,
	ProductGroup,
	Carrier,
	Coupon,
	Order,
	OrderDetail,
	ShippingInformation,
	Livestream,
	Note,
	Log,
	CommentSample,
	MessageSample,
	ImportReceipt,
	ImportReceiptDetail,
	ExportReceipt,
	ExportReceiptDetail,
	ChatBot,
	Setting
};
