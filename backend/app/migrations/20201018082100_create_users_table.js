exports.up = function (knex) {
	return knex.schema.createTable("users", (table) => {
		table.increments("id");
		table.string("name");

		table.string("phone").unique("users_unique_phone");
		table.string("email").unique("users_unique_email").notNullable();
		table.string("address");
		table.string("password");

		table.string("role").defaultTo("user");

		table.boolean("is_deleted").defaultTo(0);
		table.boolean("is_locked").defaultTo(0);

		table.integer("status").defaultTo(1);
		table.timestamps(true, true);
	});
};

exports.down = function (knex) {
	return knex.schema.dropTableIfExists("users");
};
