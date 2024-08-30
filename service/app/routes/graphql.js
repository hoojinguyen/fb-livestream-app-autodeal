const mount = require("koa-mount");
const koaPlayground = require("graphql-playground-middleware-koa").default;

const schema = require("../schema");
const graphqlHTTP = require("koa-graphql");
module.exports = {
  attach(router, app) {
    app.use(
      mount(
        "/graphql",
        graphqlHTTP({
          schema,
          graphiql: false
        })
      )
    );

    router.all(
      "/playground",
      koaPlayground({
        endpoint: "/graphql"
      })
    );
  }
};
