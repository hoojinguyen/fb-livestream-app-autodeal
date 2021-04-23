exports.seed = async function (knex) {
	// Deletes ALL existing entries
	return await knex("units")
		.del()
		.then(function () {
			// Inserts seed entries
			return knex("units").insert([
				{
					name: "Cái",
					description: "Cái",
					user_id: 1,
					is_default: true,
				},
				{
					name: "Tá",
					description: "Tá",
					user_id: 1,
					is_default: true,
				},
				{
					name: "Chiếc",
					description: "Chiếc",
					user_id: 1,
					is_default: true,
				},
				{
					name: "Cặp",
					description: "Cặp",
					user_id: 1,
					is_default: true,
				},
				{
					name: "Combo",
					description: "Combo",
					user_id: 1,
					is_default: true,
				},
			]);
		});
};
