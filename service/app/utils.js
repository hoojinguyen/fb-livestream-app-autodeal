const _ = require("lodash");
const bcrypt = require("bcryptjs");
const util = require("util");
const jwt = require("jwt-simple");
const moment = require("moment");

const config = require("./config");

const bcryptHash = util.promisify(bcrypt.hash);

const hashPassword = password => {
	return bcryptHash(password, 10);
};

const verifyPassword = util.promisify(bcrypt.compare);

const generateToken = user => jwt.encode(user, config.server.secretKey);

const getProfileName = profile => {
	if (!profile) {
		return "";
	}
	if (profile.name) {
		return profile.name;
	}
	return _.filter([profile.first_name, profile.last_name]).join(" ");
};

const arrayToDict = (a, value = true) => {
	let d = {};
	for (let item of a) {
		d[item] = value;
	}
	return d;
};

const toCamel = o => {
	var newO, origKey, newKey, value;
	if (o instanceof Array) {
		return o.map(function(value) {
			if (typeof value === "object") {
				value = toCamel(value);
			}
			return value;
		});
	} else {
		newO = {};
		for (origKey in o) {
			// eslint-disable-next-line no-prototype-builtins
			if (o.hasOwnProperty(origKey)) {
				newKey = _.camelCase(origKey);
				value = o[origKey];
				if (
					value instanceof Array ||
					(value && value.constructor === Object)
				) {
					value = toCamel(value);
				}
				newO[newKey] = value;
			}
		}
	}
	return newO;
};

function toSnake(o) {
	var newO, origKey, newKey, value;
	if (o instanceof Array) {
		return o.map(function(value) {
			if (typeof value === "object") {
				value = toSnake(value);
			}
			return value;
		});
	} else {
		newO = {};
		for (origKey in o) {
			// eslint-disable-next-line no-prototype-builtins
			if (o.hasOwnProperty(origKey)) {
				newKey = _.snakeCase(origKey);
				value = o[origKey];
				if (
					value instanceof Array ||
					(value && value.constructor === Object)
				) {
					value = toSnake(value);
				}
				newO[newKey] = value;
			}
		}
	}
	return newO;
}

const camelToUnderscore = arr => {
	const newArr = [];
	arr.forEach(element => {
		newArr.push(camelCaseKeysToUnderscore(element));
	});
	return newArr;
};

function camelCaseKeysToUnderscore(obj) {
	if (typeof obj != "object") return obj;

	for (var oldName in obj) {
		// Camel to underscore
		newName = oldName.replace(/([A-Z])/g, function($1) {
			return "_" + $1.toLowerCase();
		});

		// Only process if names are different
		if (newName != oldName) {
			// Check for the old property name to avoid a ReferenceError in strict mode.
			if (obj.hasOwnProperty(oldName)) {
				obj[newName] = obj[oldName];
				delete obj[oldName];
			}
		}

		// Recursion
		if (typeof obj[newName] == "object") {
			obj[newName] = camelCaseKeysToUnderscore(obj[newName]);
		}
	}
	return obj;
}

const sleep = ms => {
	return new Promise(resolve => setTimeout(resolve, ms));
};

const formatDateAndTime = value => {
	return moment(value).format("DD/MM/YYYY hh:mm");
};

const formatDate = value => {
	return moment(value).format("DD/MM/YYYY");
};

module.exports = {
	getProfileName,
	hashPassword,
	verifyPassword,
	generateToken,
	arrayToDict,
	toCamel,
	toSnake,
	sleep,
	formatDateAndTime,
	formatDate
};
