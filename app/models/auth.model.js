const { object } = require("joi");
const { Schema } = require("mongoose");
// require('./role.model');

module.exports = mongoose => {
    var userschema = mongoose.Schema(
      {
        name: {
          type: String,
          required: true,
          select: true,
        },
        email: {
          type: String,
          required: true,
          select: true,
        },
        password: {
          type: String,
          required: true,
          select: true,
        },
        mobile: {
          type: String,
          required: true,
          select: true,
        },
        role_id: {
          type: Schema.Types.ObjectId,
          ref: "role",
        },
        otp: {
          type: Number,
          required: true,
          select: true,
        },
        emailVerify: {
          type: Boolean,
          select: true,
        },
        isDeleted: { 
            type: Boolean, 
            default: false 
        },
        deletedAt: { 
            type: Date, 
            default: null 
        },
      },
      { timestamps: true }
    );

    userschema.method("toJSON", function() {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    const User = mongoose.model("user", userschema);
    return User;
};
