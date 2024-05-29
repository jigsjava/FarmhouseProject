const db = require("../models");
const helper = require("../config/s3.upload");

const FarmHouse = db.farmhouse;
const FarmCategory = db.farmcategory;
const Roles = db.role;
const FarmBook = db.farmbooking;
const FarmBookHour = db.farmbookhours;

const addFarm = async (req, res) => {
  const user = req.user;
  const { id, role_id } = user;

  // console.log("user",user)

  try {
    const role = await Roles.findById(role_id);

    const {
      farmName,
      description,
      location,
      latitude,
      longitude,
      price,
      farm_Category,
    } = req.body;

    const { postImages } = req.files;

    const images = await helper.imageUpload(postImages, "post-images");

    const newFarmHouse = new FarmHouse({
      farmName,
      description,
      location: {
        street: location.street,
        city: location.city,
        state: location.state,
      },
      latitude,
      longitude,
      OwnerBy: id,
      price,
      farm_Category,
      images: images.imageURLs,
    });

    if (role.role_name == "vender" || role.role_name == "admin") {
      const farm = await newFarmHouse.save();

      if (farm) {
        return res.send({ farm, message: "Farm registered successfully" });
      }
    } else {
      return res
        .status(403)
        .send({ message: "You don't have access to add this data" });
    }
  } catch (error) {
    console.log(error);
  }
};

const updateFarmData = async (req, res) => {
  const id = req.query.id;

  try {
    const {
      farmName,
      description,
      location,
      latitude,
      longitude,
      OwnerBy,
      price,
      farmHouserCategory,
    } = req.body;

    let updatedFields = {
      farmName,
      description,
      latitude,
      longitude,
      OwnerBy,
      price,
      farmHouserCategory,
    };

    if (location) {
      updatedFields.location = {
        street: location.street,
        city: location.city,
        state: location.state,
      };
    }

    updatedFields = Object.fromEntries(
      Object.entries(updatedFields).filter(([_, v]) => v !== undefined)
    );

    const farm = await FarmHouse.findByIdAndUpdate(id, updatedFields, {
      new: true,
    });

    if (farm) {
      return res.send({ farm, message: "Farm data updated successfully" });
    } else {
      return res.status(404).send({ message: "Farm not found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

const getFarms = async (req, res) => {
  try {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);

    const condition = {
      $and: [
        { "location.city": "New York" },
        { price: { $gte: 2000, $lte: 5000 } },
        { farmName: { $regex: "Pramukh", $options: "i" } },
      ],
      // $or:[
      //   {"location.city":"New York"},
      //   {price:{$gte:2000,$lte:5000}},
      //   {farmName:{$regex:"Pramukh",$options:"i"}}
      // ]
    };
    const result = await FarmHouse.aggregate([
      {
        $match: condition, //farmhouse Filter
      },
      {
        $lookup: {
          from: "users", //join marvanu hy a table name
          localField: "OwnerBy", //je table sathe join marvanu che te table local common filed
          foreignField: "_id", //join marela table ni field
          as: "owner_data", //key name of joining part
        },
      },

      // data array mathi object ma krva mate
      {
        $unwind: {
          path: "$owner_data",
          preserveNullAndEmptyArrays: true, // Preserve documents if no matching role is found
        },
      },
      {
        $match: {
          "owner_data.name": "Hari", //user table filter
        },
      },
      {
        $lookup: {
          from: "farmcategories",
          localField: "farm_Category",
          foreignField: "_id",
          as: "category_data",
        },
      },
      {
        $unwind: {
          path: "$category_data",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: {
          "category_data.farm_category": "vill",
          // "category_data.farm_category": "resort",//role table filter
        },
      },
      {
        $lookup: {
          from: "roles",
          localField: "owner_data.role_id",
          foreignField: "_id",
          as: "role_data",
        },
      },
      {
        $unwind: {
          path: "$role_data",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: {
          "role_data.role_name": "vender", //role table filter
          //  "role_data.role_name": "admin", //role table filter
        },
      },
      {
        $project: {
          _id: 1,
          description: 1,
          farmName: 1,
          price: 1,
          location: 1,
          owner_information: "$owner_data",
          email: "$owner_data.email",
          name: "$owner_data.name",
          category_information: "$category_data",
          category: "$category_data.farm_category",
          role_information: "$role_data",
        },
      },

      // pagiantion details
      {
        $facet: {
          //facet use for multiple operation
          metadata: [{ $count: "total" }], // Count the total number of documents
          data: [
            { $skip: (page - 1) * limit }, // Skip documents based on pagination
            { $limit: limit }, // Limit the number of documents per page
          ],
        },
      },
    ]).exec();

    const count =
      result[0].metadata.length > 0 ? result[0].metadata[0].total : 0;
    const data = result[0].data;

    return res.send({ count, data });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getFarmCategory = async (req, res) => {
  try {
    const framcategory = await FarmCategory.find();

    return res.status(200).json({
      data: framcategory,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const FarmBooking = async (req, res) => {
  const user = req.user;
  const { id} = user;
 
  try {
    const {
      farmhouse_id,
      startdate,
      enddate,
      paymentMode,
      paymentStatus,
      amount,
    } = req.body;

 const startDate = new Date(startdate);
  const endDate = new Date(enddate);

  const overlappingBookings = await FarmBook.find({
    farmhouse_id,
    $or: [
      {
        startdate: { $lte: endDate },
        enddate: { $gte: startDate }
      }
    ]
  });

  if (overlappingBookings.length > 0) {
    return res.status(400).send({ message: "This farmhouse is already booked for the selected dates." });
  }

    const newFarmBook = new FarmBook({
      farmhouse_id,
      bookedBy: id,
      startdate,
      enddate,
      paymentMode,
      paymentStatus,
      amount,
    });

    const farm = await newFarmBook.save();

    if (farm) {
      return res.send({ farm, message: "Farm registered successfully" });
    }
  } catch (error) {
    console.log(error);
  }
};

const farmBookingHistory = async(req, res) => {
  const user = req.user;
  const { id} = user;
  condition ={}

  try {

    // Step 1: Retrieve the booking history for the user
    const history = await FarmBook.find({ bookedBy: id }).sort({ startdate: -1 });

    if (!history.length) {
      return res.status(404).send({ message: "No bookings found for this user." });
    }

    // Step 2: Use the history data to construct a match condition
    const farmhouseIds = history.map(booking => booking.farmhouse_id);

    const matchCondition = { farmhouse_id: { $in: farmhouseIds } };


    const result = await FarmBook.aggregate([
      {
         $match: {
          ...matchCondition,
        },
      },
      {
        $lookup: {
          from: "farmhousedatas", //join marvanu hy a table name
          localField: "farmhouse_id", //je table sathe join marvanu che te table local common filed
          foreignField: "_id", //join marela table ni field
          as: "farm_data", //key name of joining part
        },
      },
      // data array mathi object ma krva mate
      {
        $unwind: {
          path: "$farm_data",
          preserveNullAndEmptyArrays: true, // Preserve documents if no matching role is found
        },
      },
      {
        $match: {
          // "owner_data.name": "Hari", //user table filter
        },
      },
      
      {
        $project: {
          _id: 1,
          paymentMode: 1,
          amount: 1,
          paymentStatus:1,
          // farm_information: "$farm_data",
          farmName:"$farm_data.farmName",
          description:"$farm_data.description"
        },
      },

    ]).exec();

    return res.status(200).json({
      data: result,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

const FarmBookHours = async (req, res) => {
  const user = req.user;
  const { id} = user;
 
  try {
    const {
      farmhouse_id,
      starttime,
      endtime,
      bookingdate
    } = req.body;

    const bookingDate = new Date(bookingdate);
  
    if (starttime >= endtime) {
      return res.status(400).send({ message: "End time must be after start time." });
    }

    const overlappingBookings = await FarmBookHour.find({
      farmhouse_id,
      bookingdate: bookingDate,
      $or: [
        { starttime: { $lt: endtime, $gte: starttime } },
        { endtime: { $gt: starttime, $lte: endtime } },
        { starttime: { $lte: starttime }, endtime: { $gte: endtime } }
      ]
    });

    if (overlappingBookings.length > 0) {
      return res.status(400).send({ message: "This farmhouse is already booked for the selected time slot." });
    }

    const newFarmBookHour = new FarmBookHour({
      farmhouse_id,
      bookedBy: id,
      starttime,
      endtime,
      bookingdate: bookingDate
    });

    const farm = await newFarmBookHour.save();

    if (farm) {
      return res.send({ farm, message: "Farm registered successfully" });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  addFarm,
  updateFarmData,
  getFarms,
  getFarmCategory,
  FarmBooking,
  farmBookingHistory,
  FarmBookHours
};
