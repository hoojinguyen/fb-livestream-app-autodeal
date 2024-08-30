exports.up = function(knex) {
	return knex.schema.createTable("message_samples", table => {
		table.increments("id");

		table.integer("user_id").unsigned();
		table.foreign("user_id").references("users.id");

		table.string("title");
		table.string("content");

		table.boolean("is_deleted").defaultTo(0);
		table.integer("status").defaultTo(1);
		table.timestamps(true, true);
	});
};

exports.down = function(knex) {
	return knex.schema.dropTableIfExists("message_samples");
};
