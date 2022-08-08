const Post = require('../models/post.model')

exports.getAllPostsQuery = () => {
    return Post.find({}).exec()
}

exports.getPostQuery = (postId) => {
    return Post.findOne({ _id: postId }).exec()
}

exports.getUserPostsQuery = (userId) => {
    return Post.find({ userId: userId }).exec()
}

exports.modifyPostQuery = (postId, postObject) => {
    return Post.findByIdAndUpdate(postId, { ...postObject, _id: postId }).exec()
}

exports.deletePostQuery = (postId) => {
    return Post.findByIdAndDelete(postId).exec()
}
