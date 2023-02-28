const mongoose = require('mongoose');


const Schema = mongoose.Schema;

let postSchema = new Schema ({
    name: {type: String},
    userid: {type: String},
    content: {type: String},
    likes: {type: Number},
    comments: [{
        text: {type: String},
        user: {type: String},
        userid: {type: String}
        }]
});

module.exports = mongoose.model("posts", postSchema);