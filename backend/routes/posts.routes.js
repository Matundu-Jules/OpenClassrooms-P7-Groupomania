const postsCtlr = require('../controllers/posts.controller')
const jwt = require('../config/jwt.config')
const router = require('express').Router()
const multer = require('../config/multer.config')
const createValidation = require('../middlewares/createPostValidationMiddleware')
const modifyValidation = require('../middlewares/modifyPostValidationMiddleware')
const postSchema = require('../validations/postsValidation')
const modifyPostSchema = require('../validations/modifyPostValidation')

// router.get('/:id', jwt.verifyJwtToken, postsCtlr.getPost)
router.get('/', jwt.verifyJwtToken, postsCtlr.getAllposts)
router.post(
    '/',
    jwt.verifyJwtToken,
    multer,
    createValidation(postSchema),
    postsCtlr.createPost
)
router.get('/myposts/:userId', jwt.verifyJwtToken, postsCtlr.getUserPosts)
router.put(
    '/:id',
    jwt.verifyJwtToken,
    multer,
    modifyValidation(modifyPostSchema),
    postsCtlr.modifyPost
)
router.delete('/:id', jwt.verifyJwtToken, postsCtlr.deletePost)
router.post('/:id/like', jwt.verifyJwtToken, postsCtlr.addLike)

module.exports = router
