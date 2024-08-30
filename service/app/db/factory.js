const { omit } = require("lodash");
const { toSnake } = require("../utils");
const Models = require("./models");
const Relations = require("./relations");

class Factory {
	constructor(model) {
		this.model = model;
		this.conditionDefault = { is_deleted: 0 };
	}

	getBookshelf() {
		return Models[this.model];
	}

	getOmits() {
		return Relations[this.model].omits;
	}

	getRelations() {
		return Relations[this.model].tables;
	}

	getCondition(cond) {
		return toSnake({ ...cond, ...this.conditionDefault });
	}

	getValues(values) {
		return toSnake({ ...values });
	}

	getSort(sort) {
		if (!sort) sort = { sortBy: "created_at", sortDirection: "desc" };
		return toSnake(sort);
	}

	findAll(cond, sort, paging) {
		const omitFields = this.getOmits();
		const bookshelf = this.getBookshelf();
		const conditions = this.getCondition(cond);
		let fetchParam = { withRelated: this.getRelations() };
		const { sort_by, sort_direction } = this.getSort(sort);
		let result = null;

		result = bookshelf
			.collection()
			.where(conditions)
			.orderBy(sort_by, sort_direction);

		if (paging) {
			const { page, size } = paging;
			const limit = size;
			const offset = page * size;
			fetchParam = { ...fetchParam, limit, offset };
		} else {
			fetchParam = { ...fetchParam, limit: 250, offset: 0 };
		}

		return result
			.fetchPage(fetchParam)
			.then(data => {
				return Promise.all(
					data.serialize().map(el => omit(el, omitFields))
				);
			})
			.catch(error => {
				// console.log("Error findAll: ", error);
				return { error };
			});
	}

	findOne(cond, isGetModel = null) {
		const omitFields = this.getOmits();
		const bookshelf = this.getBookshelf();
		const conditions = this.getCondition(cond);
		const fetchParam = {
			withRelated: this.getRelations(),
			required: false
		};
		return bookshelf
			.collection()
			.where(conditions)
			.fetchOne(fetchParam)
			.then(data => {
				if (isGetModel) {
					return data;
				}
				return omit(data.serialize(), omitFields);
			})
			.catch(error => {
				// console.log("Error findOne: ", error);
				return { error };
			});
	}

	save(values) {
		const data = this.getValues(values);
		const bookshelf = this.getBookshelf();
		return bookshelf
			.collection()
			.create(data)
			.then(async res => {
				const cond = { id: res.serialize().id };
				return await this.findOne(cond);
			})
			.catch(error => {
				console.log("Error save: ", error);
				return { error };
			});
	}

	update(id, values) {
		const bookshelf = this.getBookshelf();
		const data = this.getValues(values);

		return bookshelf
			.where({ id })
			.save({ ...data, updated_at: new Date() }, { patch: true })
			.then(async res => {
				return await this.findOne({ id });
			})
			.catch(error => {
				console.log("Error update: ", error);
				return { error };
			});
	}

	destroy(ids) {
		const bookshelf = this.getBookshelf();
		return bookshelf
			.query()
			.whereIn("id", ids)
			.update({ is_deleted: true, updated_at: new Date() })
			.then(res => {
				return ids;
			})
			.catch(error => {
				console.log("Error destroy: ", error);
				return { error };
			});
	}

	hardDelete(ids) {
		const bookshelf = this.getBookshelf();
		return bookshelf
			.query()
			.whereIn("id", ids)
			.del()
			.then(res => {
				return ids;
			})
			.catch(error => {
				console.log("Error hardDelete: ", error);
				return { error };
			});
	}
}

module.exports = model => new Factory(model);
