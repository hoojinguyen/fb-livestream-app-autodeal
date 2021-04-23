exports.up = function (knex) {
	return knex.schema.createTable("variants", (table) => {
		table.increments("id");

		table.integer("product_id").unsigned();
		table.foreign("product_id").references("products.id");

		table.string("name");
		table.string("size");
		table.string("color");
		table.string("sku");

		table.string("image");
		table.integer("stock").unsigned();

		table.integer("buy_price").unsigned();
		table.integer("sell_price").unsigned();

		table.boolean("is_deleted").defaultTo(0);
		table.integer("status").defaultTo(1);
		table.timestamps(true, true);
	});
};

exports.down = function (knex) {
	return knex.schema.dropTableIfExists("variants");
};
