exports.up = function (knex) {
	return knex.schema.createTable("stores", (table) => {
		table.increments("id");

		table.string("name");
		table.string("city");
		table.string("country");
		table.string("address");

		table.string("phone");
		table.string("email");

		table.integer("user_id").unsigned();
		table.foreign("user_id").references("users.id");

		table.boolean("is_deleted").defaultTo(0);
		table.boolean("is_locked").defaultTo(0);

		table.integer("status").defaultTo(1);
		table.timestamps(true, true);
	});
};

exports.down = function (knex) {
	return knex.schema.dropTableIfExists("stores");
};
