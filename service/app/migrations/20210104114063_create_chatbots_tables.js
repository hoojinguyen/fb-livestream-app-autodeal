exports.up = function (knex) {
	return knex.schema.createTable("chatbots", (table) => {
		table.increments("id");

		table.string("name");
		table.jsonb("content");

		table.string("facebook_page_id");
		table.string("facebook_user_id");

		table.integer("user_id").unsigned();
		table.foreign("user_id").references("users.id");

		table.boolean("is_deleted").defaultTo(0);
		table.integer("status").defaultTo(1);

		table.timestamps(true, true);
	});
};

exports.down = function (knex) {
	return knex.schema.dropTableIfExists("chatbots");
};
