const db = require("../models");
var jwt = require("jsonwebtoken");
const dbConfig = require("../config/db.config.js");
var md5 = require("md5");
const { sendMail } = require("../config/sendMail");

const User = db.users;
const Role = db.role;

const signup = async (req, res) => {
  try {
    const { name, email, password, mobile, role_id } = req.body;

    const hashedPassword = md5(password);

    const otp = Math.floor(100000 + Math.random() * 900000);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      mobile,
      role_id,
      otp,
      emailVerify: false,
    });

    const user = await newUser.save();

    // await sendMail(
    //     email,
    //     "welcome to our FarmHouseBooking Portal",
    //     `Your OTP :${otp}`
    //   );

    if (user) {
      return res.send({ user, message: "User registered successfully" });
    }
  } catch (error) {
    console.log(error);
  }
};

const emailVerify = async (req, res) => {
  try {
    const { otp, email } = req.body;

    const user = await User.findOneAndUpdate(
      { email: email, otp: otp },
      { emailVerify: true },
      { new: true }
    );
    if (user) {
      return res.send({ user, message: "Otp verification successful" });
    }
    return res.status(404).send({ message: "Otp or Email is invalid" });
  } catch (error) {
    console.log(error);
  }
};

const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

    user.otp = otp;
    await user.save();

    await sendMail(
      email,
      "Your OTP for FarmHouseBooking Portal",
      `Your new OTP: ${otp}`
    );

    return res.send({ message: "OTP resent successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email, password: password });
    console.log("email.verify", typeof user.emailVerify, user.emailVerify);
    if (user) {
      if (!user.emailVerify) {
        return res.status(403).send({ message: "Email is not verified yet" });
      }

      const token = jwt.sign(user.toJSON(), dbConfig.secretKey, {
        expiresIn: "30d",
      });

      return res.send({ user, token });
    }

    return res.status(404).send({ message: "Email or password are invalid" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

const forgotpassword = async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.body.email,
    });

    if (user) {
      const otp = Math.floor(100000 + Math.random() * 900000);

      user.otp = otp;
      await user.save();

      // await sendMail(
      //   req.body.email,
      //   "Your OTP",
      //   otp
      // );

      return res.send({ message: "OTP send to your mail" });
    }
    return res.status(404).send({ message: "User not found" });
  } catch (error) {
    console.log(error);
  }
};

const setpassword = async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.body.email,
    });

    if (user) {
      const newPassword = md5(req.body.password);

      if (user.password === newPassword) {
        return res
          .status(400)
          .send({
            message: "New password cannot be the same as the old password",
          });
      }

      user.password = newPassword;

      await user.save();

      return res.send({ message: "New Password Saved Successfully" });
    }
    return res.status(404).send({ message: "User not found" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

const getRole = async (req, res) => {
  try {
    const roles = await Role.find();

    return res.status(200).json({
      data: roles,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteUser = async (req, res) => {
  
// ===frontend Integration ===
//   const response = await axios.delete(`http://localhost:3000/api/auth/${userId}`);
  try {

//  const userId = req.params.userId   
//  or

const { userId } = req.params;

    // Find the user by ID and update the deleted field to true
    const user = await User.findByIdAndUpdate(
      userId,
      { isDeleted: true, deletedAt: new Date() },
      { new: true }
    );

    if (user) {
      return res.send({ user, message: "User deleted successfully" });
    } else {
      return res.status(404).send({ message: "User not found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

module.exports = {
  login,
  signup,
  emailVerify,
  forgotpassword,
  setpassword,
  getRole,
  resendOtp,
  deleteUser,
};
