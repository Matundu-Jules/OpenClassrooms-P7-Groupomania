const yup = require('yup')

const userSchema = yup.object({
    pseudo: yup.string().trim().strict(true).min(3).max(15).required(),
    email: yup.string().email().required(),
    password: yup.string().min(5).required(),
})

module.exports = userSchema
