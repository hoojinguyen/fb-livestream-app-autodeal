require("dotenv").config();

let env = process.env;

function intValue(value, defaultValue) {
	return parseInt(value) || defaultValue;
}

let server = {
	secure: env.SERVER_SECURE == "true" || false,
	port: intValue(env.PORT, 1234),
	host: env.SERVER_HOST || "localhost",
	secretKey: env.SECRET_KEY || "",
	adminEmail: env.ADMIN_EMAIL || "",
	guestEmail: env.GUEST_EMAIL || ""
};

let protocol = server.secure ? "https" : "http";
let port = server.port == 80 || server.port == 443 ? "" : `:${server.port}`;
let serverURL = `${protocol}://${server.host}${port}`;
server.url = env.SERVER_URL || serverURL;

module.exports = {
	server,
	auth: {
		firebase: {
			databaseURL: env.FIREBASE_DATABASE_URL || ""
		},
		facebook: {
			clientID: env.FACEBOOK_APP_ID || "",
			clientSecret: env.FACEBOOK_APP_SECRET || "",
			callbackURL: server.url + "/auth/facebook/callback",
			profileFields: ["id", "emails", "name", "picture", "link"],
			passportOptions: { scope: ["email"] },
			accessToken: env.FACEBOOK_APP_ACCESS_TOKEN || "",
			appMode: env.FACEBOOK_APP_MODE || "",
			businessId: env.FACEBOOK_BUSINESS_ID || ""
		}
	},
	db: {
		client: "pg",
		connection: env.DB_CONN || "",
		migrations: {
			tableName: "migrations"
		},
		seed: {
			directory: "./seeds"
		},
		pool: { min: 5, max: 64 }
	},
	aws: {
		accessKeyId: env.AWS_ACCESS_KEY_ID || "AKIAJWI6SKSWNZSU5ZJQ",
		secretAccessKey:
			env.AWS_SECRET_ACCESS_KEY ||
			"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",
		bucketName: env.AWS_BUCKET_NAME || "flad-hkteam",
		bucketRegion: env.AWS_BUCKET_REGION || "s3-ap-southeast-1",
		s3: {
			signedUrlExpiry: parseInt(env.AWS_S3_SIGNED_URL_EXPIRY) || 3600,
			publicUrl:
				env.AWS_S3_PUBLIC_URL ||
				"https://flad-hkteam.s3-ap-southeast-1.amazonaws.com",
			buckets: {
				uploads:
					env.AWS_UPLOADS_BUCKET_NAME ||
					env.AWS_BUCKET_NAME ||
					"flad-hkteam"
			}
		},
		ses: {
			region: env.AWS_SES_REGION || ""
		}
	}
};
