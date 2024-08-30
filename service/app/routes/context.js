const { hasPermission } = require("../lib/permissions");
const { toCamel } = require("../utils");

const protectedRoute = async (permission, fn, ctx) => {
	let ok = await hasPermission(ctx.state.user, permission, ctx.params);
	if (!ok) {
		ctx.throw(401, `Unauthorized, need '${permission}' permission`);
		return null;
	}
	return await fn(ctx);
};

const status = {
	success: 200,
	failed: 400,
	notFound: 404,
	serverError: 500
};

const responses = () => {
	return {
		SUCCESS: (ctx, data, action, model) => {
			dataCamel = data;
			if (data) {
				dataCamel = toCamel(data);
			}
			ctx.status = status["success"];
			ctx.body = {
				message: `${action} ${model} successfully !`,
				status: true,
				data: dataCamel
			};
		},
		FAILED: (ctx, error) => {
			ctx.status = status["failed"];
			ctx.body = {
				status: false,
				error: {
					message: `${error.message}` || ""
				}
			};
		},
		NOTFOUND: (ctx, model) => {
			ctx.status = status["notFound"];
			ctx.body = {
				status: false,
				error: {
					message: `${model} is not found !`,
					type: "notFound"
				}
			};
		},
		DUPLICATE: (ctx, model) => {
			console.log("🚀 ~ responses ~ model", model);
			ctx.status = status["failed"];
			ctx.body = {
				status: false,
				error: {
					message: `${model} is existing !`,
					type: "duplicate"
				}
			};
		},
		CUSTOM: (ctx, status, statusResult, message, data) => {
			ctx.status = status;
			ctx.body = {
				status: statusResult,
				message: message,
				data: toCamel(data)
			};
		}
	};
};

module.exports = { protectedRoute, responses };
