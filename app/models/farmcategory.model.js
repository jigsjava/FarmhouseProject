const { Schema } = require("mongoose");

module.exports = mongoose => {
    var farmcategoryschema = mongoose.Schema(
        {
            farm_category: {
                type: String,
                required: true,
                select: true
            },
        },
        { timestamps: true }
    );

    farmcategoryschema.method("toJSON", function() {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    const Farmcategory = mongoose.model("farmcategory", farmcategoryschema);
    return Farmcategory;
};
