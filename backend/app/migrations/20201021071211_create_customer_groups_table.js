exports.up = function (knex) {
	return knex.schema.createTable("customer_groups", (table) => {
		table.increments("id");
		table.string("name");
		table.string("code");
		table.string("description");
		table.integer("user_id").unsigned();
		table.foreign("user_id").references("users.id");

		table.integer("status").defaultTo(1);
		table.boolean("is_deleted").defaultTo(0);
		table.timestamps(true, true);
	});
};

exports.down = function (knex) {
	return knex.schema.dropTableIfExists("customer_groups");
};
