const { Schema } = require("mongoose");

module.exports = mongoose => {
    var farmschema = mongoose.Schema(
        {
            farmName: {
                type: String,
                required: true,
                select: true
            },
            description: {
                type: String,
                required: true,
                select: true
            },
            location: {
                city: {
                    type: String,
                    required: false,
                    select: true 
                },
                street: {
                    type: String,
                    required: false,
                    select: true
                },
                state: {
                    type: String,
                    required: false,
                    select: true
                },
            },

            latitude: {
                type: Number,
                required: true,
                select: true
            },
            longitude: {
                type: Number,
                required: true,
                select: true
            },
            OwnerBy: {
                type: Schema.Types.ObjectId,
                ref : "user",
            },
            price: {
                type: Number,
                required: true,
                select: true
            },
            farm_Category: {
                type: Schema.Types.ObjectId,
                ref : "farmcategory",
            },
            images:{
                type: [String],
                select: true,
                required: true,
              }
        },
        { timestamps: true }
    );

    farmschema.method("toJSON", function() {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    const FarmHouse = mongoose.model("farmhousedata", farmschema);
    return FarmHouse;
};
