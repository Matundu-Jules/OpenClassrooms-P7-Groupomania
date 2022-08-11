const Post = require('../models/post.model')

// Récupérer un post via son id //
exports.getPostQuery = (postId) => {
    return Post.findOne({ _id: postId }).exec()
}

// Récupérer tout les posts //
exports.getAllPostsQuery = () => {
    return Post.find({}).exec()
}

// Récupérer tout les posts d'un user via l'userId //
exports.getUserPostsQuery = (userId) => {
    return Post.find({ userId: userId }).exec()
}

// Modifier un post dans la BDD //
exports.modifyPostQuery = (postId, postObject) => {
    return Post.findByIdAndUpdate(postId, { ...postObject, _id: postId }).exec()
}

// Supprimer un post via son id //
exports.deletePostQuery = (postId) => {
    return Post.findByIdAndDelete(postId).exec()
}
