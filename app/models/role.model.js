const { Schema } = require("mongoose");

module.exports = mongoose => {
    var roleschema = mongoose.Schema(
        {
            role_name: {
                type: String,
                required: true,
                select: true
            },
        },
        { timestamps: true }
    );

    roleschema.method("toJSON", function() {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    const Role = mongoose.model("role", roleschema);
    return Role;
};
