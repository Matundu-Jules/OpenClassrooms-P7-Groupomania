const mongoose = require("mongoose");

// Création du Schema Sauce :
const postSchema = mongoose.Schema({
    userId: String,
    title: String,
    imageUrl: String,
    text: String,
    likes: Number,
    dislikes: Number,
    usersLiked: [String],
    usersDisliked: [String],
    createdAt: Date,
});

module.exports = mongoose.model("Post", postSchema);
