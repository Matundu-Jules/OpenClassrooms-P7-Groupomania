const mongoose = require("mongoose");

// Création du Schema Sauce :
const postSchema = mongoose.Schema({
    userId: String,
    name: String,
    manufacturer: String,
    description: String,
    mainPepper: String,
    imageUrl: String,
    heat: Number,
    likes: Number,
    dislikes: Number,
    usersLiked: [String],
    usersDisliked: [String],
});

module.exports = mongoose.model("Post", postSchema);
