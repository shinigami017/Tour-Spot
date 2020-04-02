var mongoose = require("mongoose");
//SCHEMA SETUP
var locationSchema = new mongoose.Schema({
    title: String,
    images: [{
        type: String
    }],
    description: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }]
});

module.exports = mongoose.model("Location", locationSchema);