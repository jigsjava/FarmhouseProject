const dbConfig = require("../config/db.config.js");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
db.users = require("./auth.model.js")(mongoose);
db.farmhouse = require("./farmhouse.model.js")(mongoose);
db.role = require("./role.model.js")(mongoose);
db.farmcategory = require("./farmcategory.model.js")(mongoose);
db.farmbooking = require("./farmbooking.model.js")(mongoose);
db.farmbookhours = require("./farmbookhours.model.js")(mongoose);

module.exports = db;
