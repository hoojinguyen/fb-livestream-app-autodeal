exports.up = function (knex) {
	return knex.schema.createTable("carriers", (table) => {
		table.increments("id");

		table.string("name");
		table.string("code");
		table.string("phone");
		table.string("email");
		table.string("address");
		table.string("service");
		table.string("type");

		table.integer("user_id").unsigned();
		table.foreign("user_id").references("users.id");

		table.boolean("is_deleted").defaultTo(0);
		table.boolean("is_default").defaultTo(0);
		table.boolean("stop_tracking").defaultTo(0);

		table.integer("status").defaultTo(1);
		table.timestamps(true, true);
	});
};

exports.down = function (knex) {
	return knex.schema.dropTableIfExists("carriers");
};
