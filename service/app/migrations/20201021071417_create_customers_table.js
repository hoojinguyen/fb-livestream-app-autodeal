exports.up = function(knex) {
	return knex.schema.createTable("customers", table => {
		table.increments("id");
		table.string("name");
		table.string("code");
		table.datetime("birthday");
		table.string("phone");
		table.string("email");
		table.string("address");
		table.string("gender");
		table.string("description");

		// table.string("facebook_user_id").unique("customers_unique_facebook_id");
		table.string("facebook_user_id");
		table.integer("user_id").unsigned();
		table.foreign("user_id").references("users.id");
		table.integer("customer_group_id").unsigned();
		table.foreign("customer_group_id").references("customer_groups.id");

		table.boolean("is_deleted").defaultTo(0);
		table.boolean("is_blocked").defaultTo(0);
		table.integer("status").defaultTo(1);
		table.timestamps(true, true);
	});
};

exports.down = function(knex) {
	return knex.schema.dropTableIfExists("customers");
};
