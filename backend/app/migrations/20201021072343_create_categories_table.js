exports.up = function(knex) {
	return knex.schema.createTable("categories", table => {
		table.increments("id");

		table.integer("parent_id").unsigned();
		table.string("name");
		table.string("sku");
		table.string("description");
		table.integer("user_id").unsigned();
		table.foreign("user_id").references("users.id");
		table.foreign("parent_id").references("categories.id");

		table.boolean("is_deleted").defaultTo(0);
		table.integer("status").defaultTo(1);
		table.timestamps(true, true);
	});
};

exports.down = function(knex) {
	return knex.schema.dropTableIfExists("categories");
};
