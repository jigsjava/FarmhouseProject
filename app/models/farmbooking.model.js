const { Schema } = require("mongoose");

module.exports = (mongoose) => {
  var farmbookschema = mongoose.Schema(
    {
      bookedBy: {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
      farmhouse_id: {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
      startdate: {
        type: Date,
        required: true,
        select: true,
      },
      enddate: {
        type: Date,
        required: true,
        select: true,
      },
      paymentMode: {
        type: String,
        required: true,
        select: true,
      },
      paymentStatus: {
        type: Boolean,
        required: true,
        select: true,
      },
      amount: {
        type: Number,
        required: true,
        select: true,
      },
    },
    { timestamps: true }
  );

  farmbookschema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const FarmBooking = mongoose.model("farmbooking", farmbookschema);
  return FarmBooking;
};
