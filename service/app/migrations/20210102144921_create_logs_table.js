exports.up = function (knex) {
	return knex.schema.createTable("logs", (table) => {
		table.increments("id");

		table.integer("user_id").unsigned();
		table.foreign("user_id").references("users.id");

		table.string("action");
		table.string("user_action");
		table.string("description");
		table.string("reference");

		table.boolean("is_deleted").defaultTo(0);
		table.integer("status").defaultTo(1);
		table.timestamps(true, true);
	});
};

exports.down = function (knex) {
	return knex.schema.dropTableIfExists("logs");
};
