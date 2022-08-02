const User = require("../models/user.model");

exports.emailExistQuery = email => {
    return User.findOne({email}).exec();
};

exports.pseudoExistQuery = pseudo => {
    return User.findOne({pseudo}).exec();
};
exports.emailAndPseudoExistQuery = (email, pseudo) => {
    return User.find({email, pseudo}).exec();
}