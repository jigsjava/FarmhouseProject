
module.exports = app => {
    const auth = require("../controllers/auth.controller.js");
    const middalware = require("../config/middalware.js");
    var authrouter = require("express").Router();
    const userValidation = require("./../validation/user.validation.js");

    authrouter.post("/signup", userValidation.signupValidation, auth.signup);
    authrouter.post("/emailverify", auth.emailVerify);
    authrouter.post("/login", auth.login);
    authrouter.post("/forgotpass", auth.forgotpassword);
    authrouter.post("/setpass",userValidation.newPasswordValidation, auth.setpassword);
    authrouter.get("/getrole",auth.getRole);
    // router.get("/pagination", auth.pagination);
    // router.get('/getmyUser', auth.getmyUser);

    app.use("/api/auth", authrouter);
};