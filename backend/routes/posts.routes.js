const postsCtlr = require('../controllers/posts.controller')
const jwt = require('../config/jwt.config')
const router = require('express').Router()
const multer = require('../config/multer.config')
const validation = require('../middlewares/createPostValidationMiddleware')
const postSchema = require('../validations/postsValidation')

// router.get('/:id', jwt.verifyJwtToken, postsCtlr.getPost)
router.get('/', jwt.verifyJwtToken, postsCtlr.getAllposts)
router.post(
    '/',
    jwt.verifyJwtToken,
    multer,
    validation(postSchema),
    postsCtlr.createPost
)
router.get('/myposts/:id', jwt.verifyJwtToken, postsCtlr.getUserPosts)
router.put('/:id', jwt.verifyJwtToken, multer, postsCtlr.modifyPost)
router.delete('/:id', jwt.verifyJwtToken, postsCtlr.deletePost)
router.post('/:id/like', jwt.verifyJwtToken, postsCtlr.addLike)

module.exports = router
