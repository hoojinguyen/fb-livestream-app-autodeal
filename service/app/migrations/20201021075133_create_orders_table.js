exports.up = function(knex) {
	return knex.schema.createTable("orders", table => {
		table.increments("id");

		table.integer("customer_id").unsigned();
		table.foreign("customer_id").references("customers.id");

		table.integer("user_id").unsigned();
		table.foreign("user_id").references("users.id");

		table.integer("coupon_id").unsigned();
		table.foreign("coupon_id").references("coupons.id");

		table.string("code");
		table.string("facebook_page_id");
		table.string("facebook_user_id");
		table.string("facebook_livestream_id");

		table.integer("total");
		table.integer("subtotal");

		table.boolean("is_deleted").defaultTo(0);
		table.integer("status").defaultTo(1);
		table.timestamps(true, true);
	});
};

exports.down = function(knex) {
	return knex.schema.dropTableIfExists("orders");
};
