const _ = require("lodash");
const passport = require("koa-passport");
const config = require("../../config");
const utils = require("../../utils");
const db = require("../../db");

const dbUser = db.User;

passport.serializeUser(function(user, done) {
	done(null, _.omit(user, "password"));
});

passport.deserializeUser(function(user, done) {
	done(null, user);
});

const LocalStrategy = require("passport-local").Strategy;
passport.use(
	new LocalStrategy({ usernameField: "email" }, async function(
		email,
		password,
		done
	) {
		try {
			let user = await dbUser.findOne({ email });

			if (user.error) {
				return done(null, false, {
					message: "This email is not registered"
				});
			} else if (user.is_locked) {
				return done(null, false, {
					message: "Your account has been locked"
				});
			}

			let verify = await utils.verifyPassword(password, user.password);
			if (!verify) {
				return done(null, false, {
					message: "Incorrect credentials"
				});
			}
			return done(null, { provider: "local", payload: user });
		} catch (err) {
			return done(err, false);
		}
	})
);

const passportJwt = require("passport-jwt");
const JwtStrategy = passportJwt.Strategy,
	ExtractJwt = passportJwt.ExtractJwt;
passport.use(
	new JwtStrategy(
		{
			jwtFromRequest: ExtractJwt.fromExtractors([
				ExtractJwt.fromUrlQueryParameter("access_token"),
				ExtractJwt.fromAuthHeaderAsBearerToken()
			]),
			secretOrKey: config.server.secretKey
		},
		async function(payload, done) {
			if (!payload.id) {
				done(new Error("invalid authorization token"));
			} else {
				return done(null, { provider: "jwt", ...payload });
			}
		}
	)
);

module.exports = passport;
