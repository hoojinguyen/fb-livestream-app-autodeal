exports.up = function(knex) {
	return knex.schema.createTable("customer_reports", table => {
		table.increments("id");

		table.integer("customer_id").unsigned();
		table.foreign("customer_id").references("customers.id");

		table.integer("order_id").unsigned();
		table.foreign("order_id").references("orders.id");

		table.integer("user_id").unsigned();
		table.foreign("user_id").references("users.id");

		table.integer("count").unsigned();
		table.string("reason").unsigned();

		table.boolean("is_deleted").defaultTo(0);
		table.integer("status").defaultTo(1);
		table.timestamps(true, true);
	});
};

exports.down = function(knex) {
	return knex.schema.dropTableIfExists("customer_reports");
};
