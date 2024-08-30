exports.up = function(knex) {
	return knex.schema.createTable("shipping_information", table => {
		table.increments("id");

		table.integer("order_id").unsigned();
		table.foreign("order_id").references("orders.id");
		table.integer("carrier_id").unsigned();
		table.foreign("carrier_id").references("carriers.id");

		table.integer("shipping_price").unsigned();
		table.integer("deposit_price").unsigned();
		table.integer("cod_price").unsigned();

		table.integer("weight").unsigned();
		table.string("size");

		table.datetime("delivery_date");
		table.datetime("receipt_date");

		table.string("receiver");
		table.string("phone");
		table.string("address");
		table.string("note");

		table.boolean("is_deleted").defaultTo(0);
		table.integer("status").defaultTo(1);
		table.timestamps(true, true);
	});
};

exports.down = function(knex) {
	return knex.schema.dropTableIfExists("shipping_information");
};
