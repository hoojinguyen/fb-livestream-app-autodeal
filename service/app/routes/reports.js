const { protectedRoute, responses } = require("./context");
const { SUCCESS, FAILED, NOTFOUND } = responses();
const moment = require("moment");
const db = require("../db");
const Relations = require("../db/relations");

const knex = db.knex;

const dbOrder = db.Order;
const orderRelation = Relations["Order"];

const orderTemp = {
	data: [
		{ id: 1, date: "20/10/2020", total: 10, revenue: 12000000 },
		{ id: 2, date: "21/10/2020", total: 12, revenue: 54050000 }
	],
	labels: ["20/10/2020", "21/10/2020"],
	datasets: {
		total: [10, 12],
		revenue: [12000000, 54050000]
	}
};

const randomColor = Math.floor(Math.random() * 16777215).toString(16);

const getDateTo = date => {
	return moment(date)
		.add(1, "days")
		.format("YYYY-MM-DD");
};
const getDateFrom = date => {
	return moment(date)
		.add(1, "days")
		.format("YYYY-MM-DD");
};

const getListDate = (from, to) => {
	var start = moment(from);
	var end = moment(to);

	var list = [];

	for (var current = start; current <= end; current.add(1, "d")) {
		list.push(current.format("DD/MM/YYYY"));
	}
	return list;
};

const formatDate = value => {
	return moment(value).format("DD/MM/YYYY");
};

const getRandomInt = () => {
	min = Math.ceil(19999);
	max = Math.floor(9999999);
	return Math.floor(Math.random() * (max - min) + min);
};

const handleReportByOrder = async (data, user) => {
	let { reportBy, reportType, from, to } = data;
	if (reportType == "another") {
		let dateTo = getDateTo(to);
		let dateFrom = getDateFrom(from);

		const result = await knex("orders")
			.select("*")
			.where("user_id", user.id)
			.whereBetween("created_at", [dateFrom, dateTo])
			.orderBy("created_at", "asc");

		let lookup = {};
		let order = {
			data: [],
			labels: [],
			datasets: {
				total: [],
				revenue: []
			}
		};
		if (result.length) {
			for await (const item of result) {
				let params = {
					id: getRandomInt(),
					date: formatDate(item.created_at),
					total: 1,
					revenue: item.total
				};
				let dataLookup = lookup[params.date];
				if (dataLookup) {
					params.total = dataLookup.total + 1;
					params.revenue = dataLookup.revenue + item.total;
				}
				lookup[params.date] = params;
			}
		}
		order.labels = getListDate(dateFrom, dateTo);
		order.data = await order.labels.map(date => {
			let data = {
				id: getRandomInt(),
				date,
				total: 0,
				revenue: 0
			};
			if (lookup[date]) {
				data = lookup[date];
			}

			order.datasets.total.push(data.total);
			order.datasets.revenue.push(data.revenue);
			return data;
		});
		return order;
	} else {
		// Lay theo co ngay hien tai, hom qua hom kia, ...
		return null;
	}
};

const productTemp = {
	dataCategory: [
		{
			id: 1,
			name: "Áo",
			code: "A1",
			totalSale: 40,
			totalRevenu: 8300000,
			totalBuyPrice: 12600000,
			totalSalePrice: 21900000
		},
		{
			id: 2,
			name: "Quần",
			code: "Q1",
			totalSale: 44,
			totalRevenu: 2200000,
			totalBuyPrice: 5200000,
			totalSalePrice: 6200000
		},
		{
			id: 3,
			name: "Giày",
			code: "G1",
			totalSale: 12,
			totalRevenu: 3200000,
			totalBuyPrice: 2800000,
			totalSalePrice: 6000000
		}
	],
	dataProduct: [
		{
			id: 1,
			name: "Áo thun cổ tròn",
			sku: "ATCT",
			total: 40,
			totalSale: 12,
			totalInventory: 28,
			totalRevenu: 4500000,
			totalBuyPrice: 9000000,
			totalSalePrice: 14500000
		},
		{
			id: 2,
			name: "Áo Sơ mi tay dài",
			sku: "ASMTD",
			total: 40,
			totalSale: 23,
			totalInventory: 17,
			totalRevenu: 3200000,
			totalBuyPrice: 2800000,
			totalSalePrice: 6000000
		},
		{
			id: 3,
			name: "Áo khoác da",
			sku: "AKD",
			total: 40,
			totalSale: 5,
			totalInventory: 35,
			totalRevenu: 600000,
			totalBuyPrice: 800000,
			totalSalePrice: 1400000
		},
		{
			id: 4,
			name: "Quần tây nam",
			sku: "QTN",
			total: 40,
			totalSale: 32,
			totalInventory: 8,
			totalRevenu: 1200000,
			totalBuyPrice: 2000000,
			totalSalePrice: 3200000
		},
		{
			id: 5,
			name: "Quần Jocker Nam",
			sku: "QJK",
			total: 40,
			totalSale: 12,
			totalInventory: 28,
			totalRevenu: 1000000,
			totalBuyPrice: 3200000,
			totalSalePrice: 4200000
		},
		{
			id: 5,
			name: "Giày tây",
			sku: "GT",
			total: 20,
			totalSale: 12,
			totalInventory: 8,
			totalRevenu: 3200000,
			totalBuyPrice: 2800000,
			totalSalePrice: 6000000
		}
	],
	labelsProduct: [
		"Áo thun cổ tròn",
		"Áo Sơ mi tay dài",
		"Áo khoác da",
		"Quần tây nam",
		"Quần Jocker Nam",
		"Giày tây"
	],
	labelsCategory: ["Áo", "Quần", "Giày"],
	datasetsProduct: {
		total: [12, 23, 5, 32, 12, 12],
		backgroundColor: [
			"#42A5F5",
			"#66BB6A",
			"#FFA726",
			"#26C6DA",
			"#7E57C2",
			"#FFD053"
		]
	},
	datasetsCategory: {
		total: [40, 44, 12],
		backgroundColor: ["#42A5F5", "#66BB6A", "#FFA726"],
		hoverBackgroundColor: ["#64B5F6", "#81C784", "#FFB74D"]
	}
};

const getByOrder = async ctx => {
	const { user } = ctx.state;

	if (user) {
		let { body } = ctx.request;

		let result = null;
		try {
			result = await handleReportByOrder(body, user);
		} catch (error) {
			return FAILED(ctx, error);
		}

		return SUCCESS(ctx, result, "Get", "Report Order");
	}
};
const getByProduct = async ctx => {
	const { user } = ctx.state;

	if (user) {
		let { body } = ctx.request;
		console.log("🚀 ~ body", body);

		let result = null;
		try {
			result = productTemp;
		} catch (error) {
			return FAILED(ctx, error);
		}

		return SUCCESS(ctx, result, "Get", "Report Product");
	}
};
const getByCustomer = async ctx => {};
const getByFanPage = async ctx => {};

module.exports = {
	attach(router) {
		router.post("/reports/order", ctx =>
			protectedRoute("user", getByOrder, ctx)
		);
		router.post("/reports/product", ctx =>
			protectedRoute("user", getByProduct, ctx)
		);
		router.post("/reports/customer", ctx =>
			protectedRoute("user", getByCustomer, ctx)
		);
		router.post("/reports/page", ctx =>
			protectedRoute("user", getByFanPage, ctx)
		);
	}
};
