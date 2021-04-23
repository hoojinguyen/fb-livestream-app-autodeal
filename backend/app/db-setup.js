const db = require("./db");
const config = require("./config");
const utils = require("./utils");
const { hashPassword } = require("./utils");

const dbUser = db.User;

const initAdminUser = async () => {
	let email = config.server.adminEmail;
	let admin = await dbUser.findOne({ email });

	if (admin.error) {
		admin = {
			email,
			name: "Admin",
			password: await hashPassword("123456"),
			role: "admin"
		};
		admin = await dbUser.save(admin);
	}

	return admin;
};

const initGuestUser = async () => {
	let email = config.server.guestEmail;
	let guest = await dbUser.findOne({ email });
	if (guest.error) {
		guest = {
			email,
			name: "Guest",
			password: await hashPassword("123456"),
			role: "user"
		};
		guest = await dbUser.save(guest);
	}

	return guest;
};

const dbSetup = async () => {
	let admin = await initAdminUser();
	let guest = await initGuestUser();
	return {
		admin,
		guest,
		adminToken: utils.generateToken(guest)
	};
};

module.exports = dbSetup;
