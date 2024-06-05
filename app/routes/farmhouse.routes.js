module.exports = app => {
    const farmhouse = require("../controllers/farmhouse.controller.js");
    var farmrouter = require("express").Router();
    const { listMulter } = require('../config/multer');
    const userValidation = require("./../validation/user.validation.js");
    const middalware = require("../config/middalware.js");

    farmrouter.post("/addfarm",middalware.verifyToken,listMulter,farmhouse.addFarm);
    farmrouter.put("/updatefarm",middalware.verifyToken,farmhouse.updateFarmData);
    farmrouter.get("/getfarm",farmhouse.getFarms);
    farmrouter.get("/getcategory",farmhouse.getFarmCategory);
    farmrouter.post("/farmbook",middalware.verifyToken,farmhouse.FarmBooking);
    farmrouter.get("/farmbookhistory",middalware.verifyToken,farmhouse.farmBookingHistory);
    farmrouter.post("/farmbookhours",middalware.verifyToken,farmhouse.FarmBookHours);
   
    app.use("/api/farmhouse", farmrouter);
};