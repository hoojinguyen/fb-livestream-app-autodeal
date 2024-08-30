exports.up = function (knex) {
	return knex.schema.createTable("products", (table) => {
		table.increments("id");

		table.integer("unit_id").unsigned();
		table.foreign("unit_id").references("units.id");
		table.integer("category_id").unsigned();
		table.foreign("category_id").references("categories.id");
		table.integer("user_id").unsigned();
		table.foreign("user_id").references("users.id");

		table.string("name");
		table.string("sku");
		table.string("image");
		table.string("description");

		table.integer("stock").unsigned();
		table.integer("buy_price").unsigned();
		table.integer("sell_price").unsigned();

		table.string("size");
		table.integer("weight").unsigned();

		table.boolean("is_deleted").defaultTo(0);
		table.integer("status").defaultTo(1);
		table.timestamps(true, true);
	});
};

exports.down = function (knex) {
	return knex.schema.dropTableIfExists("products");
};
