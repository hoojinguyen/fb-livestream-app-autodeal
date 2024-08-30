exports.up = function (knex) {
	return knex.schema.createTable("livestreams", (table) => {
		table.increments("id");

		table.integer("syntax_id").unsigned();
		table.foreign("syntax_id").references("syntaxes.id");
		table.integer("product_group_id").unsigned();
		table.foreign("product_group_id").references("product_groups.id");
		table.string("facebook_livestream_id");
		table.string("facebook_page_id");

		table.integer("user_id").unsigned();
		table.foreign("user_id").references("users.id");

		table.integer("status").defaultTo(1);
		table.boolean("is_deleted").defaultTo(0);
		table.timestamps(true, true);
	});
};

exports.down = function (knex) {
	return knex.schema.dropTableIfExists("livestreams");
};
