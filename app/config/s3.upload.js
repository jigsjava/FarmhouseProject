const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
require('dotenv').config();

const s3Client = new S3Client({
	region: process.env.AWS_S3_REGION,
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	},
});

const getUploadedImageUrl = (key) => {
	const region = process.env.AWS_S3_REGION;
	const bucketName = process.env.AWS_S3_BUCKET_NAME;
	return `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;
};

exports.imageUpload = async (files, keyPrefix, type = 'IMAGE') => {
	try {
		const images = files;
		const imageURLs = [];

		if (!images || images.length === 0) {
			return {
				success: false,
				message: 'No files were uploaded.',
			};
		}

		const maxAllowedSize = type === 'VIDEO' || type === 'FILE' ? 30 * 1024 * 1024 : 10 * 1024 * 1024;

		const tooLargeFiles = images.filter((file) => file.size > maxAllowedSize);
		if (tooLargeFiles.length > 0) {
			return {
				success: false,
				message: 'Some files are too large',
			};
		}

		const uploadPromises = images.map((image) => {
			const { originalname, path } = image;
			const key = `${keyPrefix}/${Date.now()}-${originalname.replace(/\s/g, '')}`;

			const uploadParams = {
				Bucket: process.env.AWS_S3_BUCKET_NAME,
				Key: key,
				Body: image.buffer,
			};

			const putCommand = new PutObjectCommand(uploadParams);

			return new Promise((resolve, reject) => {
				s3Client.send(putCommand, (err, data) => {
					if (err) {
						console.error(err);
						reject({ error: `Error uploading image ${originalname} to S3` });
					} else {
						const imageUrl = getUploadedImageUrl(key);
						imageURLs.push(imageUrl);
						resolve({ originalname, url: imageUrl });
					}
				});
			});
		});

		await Promise.all(uploadPromises);

		return {
			success: true,
			imageURLs,
		};
	} catch (err) {
		return {
			success: false,
			message: 'File upload failed',
		};
	}
};

