const { Schema } = require("mongoose");

module.exports = (mongoose) => {
  var farmbookhourschema = mongoose.Schema(
    {
      bookedBy: {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
      farmhouse_id: {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
      starttime: {
        type: Number,
        required: true,
        select: true,
      },
      endtime: {
        type: Number,
        required: true,
        select: true,
      },
      bookingdate:{
        type:Date,
        require:true,
        select:true,
      }
    },
    { timestamps: true }
  );

  farmbookhourschema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const FarmBookHour = mongoose.model("farmbookhour", farmbookhourschema);
  return FarmBookHour;
};
