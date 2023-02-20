const mongoose = require('mongoose');


const Schema = mongoose.Schema;

let bookSchema = new Schema ({
    name: {type: String},
    author: {type: String},
    pages: {type: Number}

});

module.exports = mongoose.model("books", bookSchema);