const mongoose = require('mongoose');


const Schema = mongoose.Schema;

let postSchema = new Schema ({
    name: {type: String},
    userid: {type: String},
    content: {type: String},
    likes: {
        users: {type: Array},
        votes: {type: Array} 
        }
    ,
    edited: {type: String},
    comments: [{
        text: {type: String},
        user: {type: String},
        userid: {type: String},
        likes: {
            users: {type: Array},
            votes: {type: Array}
        },
        edited: {type: String}
        }],
},
{
methods: {
    amountVotes() {
        return this.likes.votes.reduce((partialSum, a) => partialSum + a, 0)
    }

}
}
);

module.exports = mongoose.model("posts", postSchema);