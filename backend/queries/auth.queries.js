const User = require('../models/user.model')

// Vérifier si l'email est déja associé à un user dans la BDD //
exports.emailExistQuery = (email) => {
    return User.findOne({ email }).exec()
}

// Vérifier si le pseudo est déja associé à un user dans la BDD //
exports.pseudoExistQuery = (pseudo) => {
    return User.findOne({ pseudo }).exec()
}
