exports.up = function (knex) {
	return knex.schema.createTable("notes", (table) => {
		table.increments("id");
		table.string("details");

		table.integer("user_id").unsigned();
		table.foreign("user_id").references("users.id");
		table.integer("customer_id").unsigned();
		table.foreign("customer_id").references("customers.id");

		table.boolean("is_deleted").defaultTo(0);
		table.integer("status").defaultTo(1);
		table.timestamps(true, true);
	});
};

exports.down = function (knex) {
	return knex.schema.dropTableIfExists("notes");
};
