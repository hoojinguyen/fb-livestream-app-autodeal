// const graphql = require("./graphql");
const auth = require("./auth");
const users = require("./users");
const stores = require("./stores");
const syntaxes = require("./syntaxes");
const customers = require("./customers");
const customer_blocks = require("./customer_blocks");
const customer_groups = require("./customer_groups");
const categories = require("./categories");
const units = require("./units");
const products = require("./products");
const carriers = require("./carriers");
const coupons = require("./coupons");
const orders = require("./orders");
const orders2 = require("./orders2");
const variants = require("./variants");
const shipping_information = require("./shipping_information");
const product_groups = require("./product_groups");
const notes = require("./notes");
const logs = require("./logs");
const comments = require("./comments");
const messages = require("./messages");
const livestreams = require("./livestreams");
const reports = require("./reports");
const upload = require("./upload");
const facebook = require("./facebook");
const warehouse = require("./warehouse");

module.exports = {
	modules: [
		// graphql,
		auth,
		users,
		stores,
		syntaxes,
		customers,
		customer_blocks,
		customer_groups,
		categories,
		units,
		products,
		carriers,
		coupons,
		orders,
		orders2,
		variants,
		shipping_information,
		product_groups,
		notes,
		logs,
		messages,
		comments,
		livestreams,
		reports,
		upload,
		...facebook,
		...warehouse
	]
};
