const authCtrl = require('../controllers/auth.controller')
const router = require('express').Router()
const validation = require('../middlewares/validationMiddleware')
const userSchema = require('../validations/userValidation')

router.post('/signup', validation(userSchema), authCtrl.userSignup)
router.post('/login', authCtrl.userLogin)

module.exports = router
