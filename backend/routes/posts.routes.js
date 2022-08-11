const postsCtlr = require('../controllers/posts.controller')
const jwt = require('../config/jwt.config')
const router = require('express').Router()
const multer = require('../config/multer.config')
const createValidation = require('../middlewares/createPostValidationMiddleware')
const modifyValidation = require('../middlewares/modifyPostValidationMiddleware')
const postSchema = require('../validations/postsValidation')
const modifyPostSchema = require('../validations/modifyPostValidation')

// Route GET : Récupération de tout les posts //
router.get('/', jwt.verifyJwtToken, postsCtlr.getAllposts)

// Route POST : Créer un post //
router.post(
    '/',
    jwt.verifyJwtToken,
    multer,
    createValidation(postSchema),
    postsCtlr.createPost
)

// Route GET : Récupération de tout les posts d'un user via l'userId //
router.get('/myposts/:userId', jwt.verifyJwtToken, postsCtlr.getUserPosts)

// Route PUT : Modification de post //
router.put(
    '/:id',
    jwt.verifyJwtToken,
    multer,
    modifyValidation(modifyPostSchema),
    postsCtlr.modifyPost
)

// Route DELETE : Suppression de post //
router.delete('/:id', jwt.verifyJwtToken, postsCtlr.deletePost)

// Route POST : Ajout de like / dislike //
router.post('/:id/like', jwt.verifyJwtToken, postsCtlr.addLike)

module.exports = router
