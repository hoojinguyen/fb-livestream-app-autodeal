const { makeExecutableSchema } = require("graphql-tools");
const jmAdapt = require("join-monster-graphql-tools-adapter");

const typeDefs = require("./types");
const modules = require("./modules");
const scalars = require("./scalars");

const resolvers = {
  ...scalars,
  ...modules.resolvers,
};

const schema = makeExecutableSchema({ typeDefs, resolvers });
jmAdapt(schema, modules.jmDefs);

module.exports = schema;
