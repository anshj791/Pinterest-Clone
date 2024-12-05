const mongoose = require('mongoose');

// Define the Post Schema
const postSchema = new mongoose.Schema({
    postText: {
        type: String,
        required: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    likes: {
        type: Array,
        default: []
    },
});

// Create the Post Model
module.exports = mongoose.model('Post', postSchema);


