const AWS = require("aws-sdk");
const _ = require("lodash");
const mime = require("mime-types");

const db = require("../db");
const config = require("../config");

const s3 = new AWS.S3({
	signatureVersion: "v4",
	accessKeyId: config.aws.accessKeyId,
	secretAccessKey: config.aws.secretAccessKey,
	region: config.aws.bucketRegion,
});

const generateRandomKey = () => {
	return `${_.times(20, () => _.random(35).toString(36)).join(
		""
	)}_${process.hrtime.bigint()}`;
};

class S3Bucket {
	constructor(bucketName) {
		this.bucketName = bucketName;
	}

	createFileKey(fileName) {
		return `${generateRandomKey()}_${fileName}`;
	}

	createEntry(fileName, prefix) {
		const key = this.createFileKey(fileName);
		return prefix ? `${prefix}/${key}` : key;
	}

	async createSingleSignedUpload(fileName, folder, prefix = "") {
		const { publicUrl, signedUrlExpiry } = config.aws.s3;
		const { bucketName } = this;
		const settingDefault = {
			Bucket: folder ? `${bucketName}/${folder}` : bucketName,
			Expires: signedUrlExpiry,
			ACL: "bucket-owner-full-control",
		};

		const entry = await this.createEntry(fileName, prefix);
		const signedRequest = await s3.getSignedUrl("putObject", {
			...settingDefault,
			Key: entry,
		});
		const urlImage = folder
			? `${publicUrl}/${folder}/${entry}`
			: `${publicUrl}/${entry}`;

		return { signedRequest, urlImage };
	}

	async createMultipleSignedUpload(fileNames, folder, prefix = "") {
		const { publicUrl, signedUrlExpiry } = config.aws.s3;
		const { bucketName } = this;
		const settingDefault = {
			Bucket: folder ? `${bucketName}/${folder}` : bucketName,
			Expires: signedUrlExpiry,
			ACL: "bucket-owner-full-control",
		};

		return Promise.all(
			fileNames.map(async (file) => {
				const entry = await this.createEntry(file, prefix);
				const signedRequest = await s3.getSignedUrl("putObject", {
					...settingDefault,
					Key: entry,
				});
				const urlImage = folder
					? `${publicUrl}/${folder}/${entry}`
					: `${publicUrl}/${entry}`;
				return { signedRequest, urlImage };
			})
		);
	}

	saveUpload(upload) {
		return db.uploads.save({
			file_name: upload.fileName,
			path: upload.key,
			type: mime.lookup(upload.fileName),
		});
	}

	async upload(file, prefix) {
		const stream = file.createReadStream();
		const entry = this.createEntry(file.filename, prefix);
		const data = await new Promise((resolve, reject) =>
			s3.upload(
				{
					Bucket: this.bucketName,
					Key: entry.key,
					Body: stream,
				},
				(err, data) => {
					if (err) {
						reject(err);
					} else {
						resolve(data);
					}
				}
			)
		);
		return {
			upload: await this.saveUpload(entry),
			url: data.Location,
		};
	}

	readObject(key) {
		return s3
			.getObject({ Bucket: this.bucketName, Key: key })
			.createReadStream();
	}
}

module.exports = {
	uploads: new S3Bucket(config.aws.s3.buckets.uploads),
};
