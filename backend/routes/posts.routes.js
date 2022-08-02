const postsCtlr = require("../controllers/posts.controller");
const jwt = require("../config/jwt.config");
const router = require("express").Router();
const multer = require("../config/multer.config");

router.get("/", jwt.verifyJwtToken, postsCtlr.getAllposts);
router.post("/", jwt.verifyJwtToken, multer, postsCtlr.createPost);
router.get("/:id", jwt.verifyJwtToken, postsCtlr.getPost);
router.put("/:id", jwt.verifyJwtToken, multer, postsCtlr.modifyPost);
router.delete("/:id", jwt.verifyJwtToken, postsCtlr.deletePost);
router.post("/:id/like", jwt.verifyJwtToken, postsCtlr.addLike);

module.exports = router;
