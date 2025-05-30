const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
});

userSchema.plugin(passportLocalMongoose); // This Automatically adds username, salt and hashed password in our userSchema

module.exports = mongoose.model("User", userSchema);