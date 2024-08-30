exports.up = function(knex) {
	return knex.schema.createTable("customer_blocks", table => {
		table.increments("id");

		table.string("reason");
		table.integer("count").unsigned();

		table.integer("customer_id").unsigned();
		table.foreign("customer_id").references("customers.id");

		table.integer("user_id").unsigned();
		table.foreign("user_id").references("users.id");

		table.integer("status").defaultTo(1);
		table.boolean("is_deleted").defaultTo(0);

		table.timestamps(true, true);
	});
};

exports.down = function(knex) {
	return knex.schema.dropTableIfExists("customer_blocks");
};
