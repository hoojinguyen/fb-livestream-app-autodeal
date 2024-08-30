exports.up = function (knex) {
	return knex.schema.createTable("settings", (table) => {
		table.increments("id");

		table.jsonb("config");

		table.integer("user_id").unsigned();
		table.foreign("user_id").references("users.id");

		table.boolean("is_deleted").defaultTo(0);
		table.integer("status").defaultTo(1);

		table.timestamps(true, true);
	});
};

exports.down = function (knex) {
	return knex.schema.dropTableIfExists("settings");
};
