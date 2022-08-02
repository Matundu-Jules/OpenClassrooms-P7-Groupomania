const Post = require("../models/post.model");

exports.getAllpostsQuery = () => {
    return Post.find({}).exec();
};

exports.getPostQuery = postId => {
    return Post.findOne({_id: postId}).exec();
};

exports.modifyPostQuery = (postId, postObject) => {
    return Post.findByIdAndUpdate(postId, {...postObject, _id: postId}).exec();
};

exports.deletePostQuery = postId => {
    return Post.findByIdAndDelete(postId).exec();
};
