const { hasPermission, permissions } = require("../lib/permissions");
const _ = require("lodash");
const jm = require("join-monster");
const escape = require("pg-escape");
const { knex } = require("../db");

const knexRunRaw = async sql => {
  const connection = await knex.client.acquireConnection();
  try {
    return await connection.query(sql);
  } finally {
    await knex.client.releaseConnection(connection);
  }
};

const join = (resolveInfo, context, fn) =>
  jm.default(
    resolveInfo,
    context,
    async sql => {
      let result = await knexRunRaw(sql);
      if (fn) {
        return fn(result);
      }
      return result;
    },
    { dialect: "pg" }
  );

const createResolver = fn => {
  return (parent, args, ctx, resolveInfo) =>
    fn(
      {
        args,
        parent,
        resolveInfo,
        join: (context, options) =>
          join(
            resolveInfo,
            _.merge({ ...ctx, user: ctx.state.user }, context),
            options
          )
      },
      ctx
    );
};

const createProtectedResolver = (permission, fn) => {
  return createResolver(async (g, ctx) => {
    let ok = await hasPermission(ctx.state.user, permission, g.args);
    if (!ok) {
      ctx.throw(401, `Unauthorized, need '${permission}' permission`);
      return null;
    }
    return await fn(g, ctx);
  });
};

module.exports = {
  createProtectedResolver,
  createResolver,
  permissions,
  escape
};
