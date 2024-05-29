module.exports = app => {
    const farmhouse = require("../controllers/farmhouse.controller.js");
    var router = require("express").Router();
    const { listMulter } = require('../config/multer');
    const userValidation = require("./../validation/user.validation.js");
    const middalware = require("../config/middalware.js");

    router.post("/addfarm",middalware.verifyToken,listMulter,farmhouse.addFarm);
    router.put("/updatefarm",middalware.verifyToken,farmhouse.updateFarmData);
    router.get("/getfarm",farmhouse.getFarms);
    router.get("/getcategory",farmhouse.getFarmCategory);
    router.post("/farmbook",middalware.verifyToken,farmhouse.FarmBooking);
    router.get("/farmbookhistory",middalware.verifyToken,farmhouse.farmBookingHistory);
    router.post("/farmbookhours",middalware.verifyToken,farmhouse.FarmBookHours);
   
    app.use("/api/farmhouse", router);
};