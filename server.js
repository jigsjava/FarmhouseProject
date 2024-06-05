const express = require("express");
const cors = require("cors");

const app = express();

var corsOptions = {
  origin: "http://localhost:8100"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const db = require("./app/models");
db.mongoose.set('debug', false);

const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  autoIndex: true,   // Automatically build indexes
  autoCreate: true,  // Automatically create collections
};

try {
 db.mongoose.connect(db.url,mongooseOptions);
  console.log("Connected to the database!");
} catch (err) {
  console.error("Cannot connect to the database!", err);
  process.exit();
}


require("./app/routes/auth.routes")(app);
require("./app/routes/farmhouse.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8100;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
