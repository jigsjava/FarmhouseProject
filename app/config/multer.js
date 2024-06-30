const multer = require('multer');

// files will be stored in memory as Buffer objects. This is useful for temporary storage
const storage = multer.memoryStorage({
	filename: (req, file, cb) => {
		cb(null, Date.now() + Math.floor(Math.random() * 1000000) + '_' + file.fieldname);
	},
});

// ===used for middleware ===
exports.listMulter = multer({ storage }).fields([
	{ name: 'postImages', maxCount: 10 },
]);