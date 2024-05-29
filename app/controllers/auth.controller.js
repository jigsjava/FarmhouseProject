const db = require("../models");
var jwt = require("jsonwebtoken");
const dbConfig = require("../config/db.config.js");
var md5 = require("md5");
const { sendMail } = require("../config/sendMail");

const User = db.users;
const Role = db.role;

const signup = async (req, res) => {
  try {
    const { name, email, password, mobile,role_id } = req.body;

    const hashedPassword = md5(password);

    const otp = Math.floor(100000 + Math.random() * 900000);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      mobile,
      role_id,
      otp,
      emailVerify:false
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
    const {otp,email} = req.body;

    const user = await User.findOneAndUpdate(
      { email: email, otp: otp },
      { emailVerify: true },
      { new: true }
    );
    if (user) {
      return res.send({ user,message: "Otp verification successful"});
    }
    return res.status(404).send({ message: "Otp or Email is invalid" });

  } catch (error) {
    console.log(error);
  }
};
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email, password: password });
    console.log("email.verify",typeof(user.emailVerify),user.emailVerify)
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
      await user.save()

      // await sendMail(
      //   req.body.email,
      //   "Your OTP",
      //   otp
      // );

      return res.send({message:"OTP send to your mail"});
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
        return res.status(400).send({ message: "New password cannot be the same as the old password" });
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
     data:roles
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// const pagination = async (req, res) => {
//   const role = req.query.role; //search role
//   const search = req.query.key; //search key

//   const sortOrder = req.query.sort; //For ASC - (1)  / DESC (-1)
//   const sortBy = req.query.sortBy || "createdAt"; //Sort-by email/ name/createdDate

//   const page = parseInt(req.query.page) || 1;
//   const limit = parseInt(req.query.limit) || 10;
//   const skip = (page - 1) * limit;

//   try {
//     let query = {
//       role: role,
//     };
//     if (search) {
//       query["$or"] = [
//         { name: { $regex: search, $options: "i" } }, //key in name or
//         { email: { $regex: search, $options: "i" } }, //key in email
//       ];
//     }

//     const users = await User.find(query)
//       .limit(limit)
//       .skip(skip)
//       .sort({ [sortBy]: parseInt(sortOrder) });
//     // console.log(users);
//     // res.json(result);
//     return res.status(200).send({ data: users });
//   } catch (error) {
//     console.error("Error fetching users:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

// const getmyUser = async (req, res) => {
//   try {
//     const name = req.query.name;
//     let condition = {};

//     if (req.query.name) {
//       condition["name"] = { $regex: new RegExp(name), $options: "i" };
//     }

//     if (req.query.email) {
//       condition["email"] = req.query.email;
//     }
//     const page = 1; // Page number
//     const limit = 5; // Number of documents per page

//     const result = await User.aggregate([
//       {
//         $match: condition,
//       },
//       {
//         $lookup: {
//           from: "roles",
//           localField: "role_id",
//           foreignField: "_id",
//           as: "user_role",
//         },
//       },
//       {
//         $unwind: {
//           path: "$user_role",
//           preserveNullAndEmptyArrays: true, // Preserve documents if no matching role is found
//         },
//       },
//       {
//         $match: {
//           // "user_role.name": "Admin",
//         },
//       },
//       {
//         $project: {
//           _id: 1,
//           name: 1,
//           email: 1,
//           role: "$user_role",
//         },
//       },
//       {
//         $facet: {
//             metadata: [ { $count: "total" } ], // Count the total number of documents
//             data: [
//                 { $skip: (page - 1) * limit }, // Skip documents based on pagination
//                 { $limit: limit } // Limit the number of documents per page
//             ]
//         }
//     }
//     ]).exec();

//     const count = (result[0].metadata.length > 0) ? result[0].metadata[0].total : 0;
//     const data = result[0].data;

//     return res.send({count, data});
//   } catch (err) {
//     res.status(500).send({
//       message: err.message || "Some error occurred while retrieving Users.",
//     });
//   }
// };

module.exports = {
  login,
  signup,
  emailVerify,
  forgotpassword,
  setpassword,
  getRole
};
