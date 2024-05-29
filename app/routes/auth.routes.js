
module.exports = app => {
    const auth = require("../controllers/auth.controller.js");
    const middalware = require("../config/middalware.js");
    var router = require("express").Router();
    const userValidation = require("./../validation/user.validation.js");

    router.post("/signup", userValidation.signupValidation, auth.signup);
    router.post("/emailverify", auth.emailVerify);
    router.post("/login", auth.login);
    router.post("/forgotpass", auth.forgotpassword);
    router.post("/setpass",userValidation.newPasswordValidation, auth.setpassword);
    router.get("/getrole",auth.getRole);
    // router.get("/pagination", auth.pagination);
    // router.get('/getmyUser', auth.getmyUser);

    
    app.use("/api/auth", router);
};