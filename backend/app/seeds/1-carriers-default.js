exports.seed = async function (knex) {
	// Deletes ALL existing entries
	return await knex("carriers")
		.del()
		.then(function () {
			// Inserts seed entries
			return knex("carriers").insert([
				{
					name: "GHN",
					user_id: 1,
				},
				{
					name: "GHTK",
					user_id: 1,
				},
				{
					name: "VNPOST",
					user_id: 1,
				},
				{
					name: "GRAB",
					user_id: 1,
				},
				{
					name: "GHN",
					user_id: 2,
				},
				{
					name: "GHTK",
					user_id: 2,
				},
				{
					name: "VNPOST",
					user_id: 2,
				},
				{
					name: "GRAB",
					user_id: 2,
				},
			]);
		});
};
