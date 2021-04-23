const requireText = require("require-text");
const graphql = require("graphql");

const source = requireText("./types.graphql", require);
const schema = graphql.parse(source);

module.exports = schema;
