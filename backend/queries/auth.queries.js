const User = require("../models/user.model");

exports.emailExistQuery = email => {
    return User.findOne({email}).exec();
};

exports.pseudoExistQuery = pseudo => {
    return User.findOne({pseudo}).exec();
};