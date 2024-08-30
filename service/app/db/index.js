const knex = require("./knex");
const _ = require("lodash");
const models = require("./models");

// Modules
const factory = require("./factory");

let factories = {};
for (const model in models) {
	factories[model] = factory(model);
}

module.exports = {
	knex,
	...factories,
};
