const authCtrl = require('../controllers/auth.controller')
const router = require('express').Router()
const validation = require('../middlewares/validationMiddleware')
const userSchema = require('../validations/userValidation')

// Route POST : Création de compte //
router.post('/signup', validation(userSchema), authCtrl.userSignup)

// Route POST : Connexion //
router.post('/login', authCtrl.userLogin)

module.exports = router
