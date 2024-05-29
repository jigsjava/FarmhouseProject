const multer = require('multer');

const storage = multer.memoryStorage({
	filename: (req, file, cb) => {
		cb(null, Date.now() + Math.floor(Math.random() * 1000000) + '_' + file.fieldname);
	},
});

exports.listMulter = multer({ storage }).fields([
	{ name: 'postImages', maxCount: 10 },
]);