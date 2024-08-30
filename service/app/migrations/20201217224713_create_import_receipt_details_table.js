exports.up = function (knex) {
	return knex.schema.createTable("import_receipt_details", (table) => {
		table.increments("id");

		table.integer("quantity").unsigned();

		table.integer("variant_id").unsigned();
		table.foreign("variant_id").references("variants.id");
		table.integer("unit_id").unsigned();
		table.foreign("unit_id").references("units.id");

		table.integer("import_receipt_id").unsigned();
		table.foreign("import_receipt_id").references("import_receipts.id");

		table.boolean("is_deleted").defaultTo(0);
		table.integer("status").defaultTo(1);
		table.timestamps(true, true);
	});
};

exports.down = function (knex) {
	return knex.schema.dropTableIfExists("import_receipt_details");
};
