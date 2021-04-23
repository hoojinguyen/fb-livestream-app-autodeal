exports.up = function (knex) {
	return knex.schema.createTable("import_receipts", (table) => {
		table.increments("id");
		table.string("name");
		table.jsonb("instant");
		table.string("code");
		table.string("delivery");
		table.string("description");
		table.integer("user_id").unsigned();
		table.foreign("user_id").references("users.id");
		table.boolean("is_deleted").defaultTo(0);
		table.integer("status").defaultTo(1);
		table.datetime("time");
		table.timestamps(true, true);
	});
};

exports.down = function (knex) {
	return knex.schema.dropTableIfExists("import_receipts");
};
