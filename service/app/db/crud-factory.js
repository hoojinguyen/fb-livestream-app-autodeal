const knex = require("./knex");
const Models = require("./models");
const Relations = require("./relations");
const { toSnake } = require("../utils");

const crud = (modelName) => {
	const bookshelf = Models[modelName];
	const relations = Relations[modelName];

	if (!bookshelf) {
		return 0;
	}
	
	return {
		findOne: async (cond) => {
			cond = await toSnake(cond);
			return bookshelf
				.collection()
				.where(cond)
				.where({ is_deleted: 0 })
				.fetchOne({
					required: false,
					withRelated: relations,
				})
				.then((result) => {
					return result;
				})
				.catch((error) => {
					return {
						error: `${modelName} is not exists or deleted !`,
					};
				});
		},

		find: async (cond, options = null) => {
			cond = await toSnake(cond);
			return bookshelf
				.collection()
				.where({ ...cond, is_deleted: 0 })
				.fetch({
					required: false,
					withRelated: relations,
				})
				.then((result) => {
					return result;
				})
				.catch((error) => {
					console.log(error);
					return { error };
				});
		},

		findAll: async (options) => {
			let result = null;
			options = await toSnake(options);

			let query = bookshelf
				.collection()
				.where({ is_deleted: false })
				.orderBy(options.sort_by, options.sort_direction);

			if (options.user_id) {
				query = query.where({ user_id: options.user_id });
			}

			if (options.page_size && options.page_index) {
				result = query.fetchPage({
					limit: options.page_size,
					offset: options.page_size * (options.page_index - 1),
					withRelated: relations,
				});
			} else {
				result = query.fetch({
					withRelated: relations,
				});
			}

			return result
				.then((result) => {
					return result;
				})
				.catch((error) => {
					return { error };
				});
		},

		save: async (values) => {
			const data = toSnake(values);
			return await bookshelf
				.collection()
				.create(data)
				.then(async (result) => {
					const response = await bookshelf
						.collection()
						.where({ id: result.id })
						.where({ is_deleted: 0 })
						.fetchOne({
							required: false,
							withRelated: relations,
						})
						.then((result) => {
							return result.serialize();
						})
						.catch((error) => {
							return {
								error: `${modelName} is not exists or deleted !`,
							};
						});

					return response;
				})
				.catch((error) => {
					console.log("Error: ", error);
					return {
						error:
							error.detail ||
							"Something's wrong ! Please try again",
					};
				});
		},

		update: async (id, values) => {
			const data = await toSnake(values);
			return await bookshelf
				.where({ id })
				.save(data, { patch: true })
				.then(async (result) => {
					const response = await bookshelf
						.collection()
						.where({ id: result.id })
						.where({ is_deleted: 0 })
						.fetchOne({
							required: false,
							withRelated: relations,
						})
						.then((result) => {
							return result.serialize();
						})
						.catch((error) => {
							return {
								error: `${modelName} is not exists or deleted !`,
							};
						});

					return response;
				})
				.catch((error) => {
					if (error instanceof bookshelf.NoRowsUpdatedError)
						return {
							error: `${modelName} is not exists or deleted !`,
						};
					return {
						error:
							error.detail ||
							"Something's wrong ! Please try again",
					};
				});
		},

		destroy: async (ids) => {
			return await bookshelf
				.query()
				.whereIn("id", ids)
				.update({ is_deleted: true })
				.returning("*")
				.catch((error) => {
					return {
						error:
							error.detail ||
							"Something's wrong ! Please try again",
					};
				});
		},

		hardDelete: async (id) => {
			return await bookshelf
				.where({ id })
				.destroy({ require: false })
				.then((data) => {
					return "Delete successfully !";
				})
				.catch((error) => {
					return {
						error: error || "Something's wrong ! Please try again",
					};
				});
		},
	};
};

module.exports = crud;
