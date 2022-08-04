const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

// Création du Schema User :
const userSchema = mongoose.Schema({
    pseudo: {type: String, require: true, unique: true},
    email: {type: String, require: true, unique: true},
    password: {type: String, require: true},
    createdAt: Date
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
