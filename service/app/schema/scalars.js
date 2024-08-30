const { GraphQLDate, GraphQLDateTime } = require("graphql-iso-date");
const GraphQLDecimal = require("graphql-type-decimal");
const { GraphQLUBigInt64 } = require("graphql-type-ints");
const { GraphQLScalarType, GraphQLError, Kind, print } = require("graphql");
const { GraphQLJSON } = require("graphql-type-json");
const { GraphQLUpload } = require("graphql-upload");

const GraphQLID = new GraphQLScalarType({
  name: "ID",
  description:
    'The `ID` scalar type represents a unique identifier, often used to refetch an object or as key for a cache. The ID type appears in a JSON response as a String; however, it is not intended to be human-readable. When expected as an input type, any string (such as `"4"`) or integer (such as `4`) input value will be accepted as an ID.',

  serialize(value) {
    // value sent to client
    return String(value);
  },

  parseValue(value) {
    const decodeValue = Buffer.from(value, "base64").toString("utf8");
    const values = decodeValue.match(/^([a-zA-Z]\w*):(\d+)$/);
    console.log("parseValue -> values", values);
    if (!values) {
      throw new GraphQLError(
        `"${String(value)}" is not a valid ID value format.`
      );
    }
    // value from the client
    return { type: values[1], value: parseInt(values[2]) };
  },

  parseLiteral(ast) {
    if (ast.kind !== Kind.STRING && ast.kind !== Kind.INT) {
      throw new GraphQLError(
        "ID cannot represent a non-string and non-integer value: " + print(ast),
        ast
      );
    }
    if (isNaN(ast.value)) {
      throw new GraphQLError(`${print(ast)} is not a valid ID value.`);
    }
    return ast.value;
  }
});

module.exports = {
  Date: GraphQLDate,
  DateTime: GraphQLDateTime,
  Decimal: GraphQLDecimal,
  UInt64: GraphQLUBigInt64,
  ID: GraphQLID,
  JSON: GraphQLJSON,
  Upload: GraphQLUpload
};
