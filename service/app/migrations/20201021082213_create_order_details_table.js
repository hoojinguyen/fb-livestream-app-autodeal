exports.up = function (knex) {
	return knex.schema.createTable("order_details", (table) => {
		table.increments("id");

		table.integer("variant_id").unsigned();
		table.foreign("variant_id").references("variants.id");

		table.integer("order_id").unsigned();
		table.foreign("order_id").references("orders.id");

		table.integer("price").unsigned();
		table.integer("quantity").unsigned();

		table.string("code");
		table.string("source");
		table.string("facebook_livestream_id");

		table.integer("total");
		table.integer("subtotal");

		table.boolean("is_deleted").defaultTo(0);
		table.integer("status").defaultTo(1);
		table.timestamps(true, true);
	});
};

exports.down = function (knex) {
	return knex.schema.dropTableIfExists("order_details");
};
