var express = require('express');
var router = express.Router();
const mongoose = require("mongoose");
const Books = require("../models/Books");
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.post('/api/book/', function(req, res, next) {
  Books.findOne({name: req.body.name}, (err, book) => {
    if(err) {
      console.log(err);
      throw err
    };
    if(book){
      return res.status(403).json({book: "Bookname already in use."});
    } else {
          Books.create(
            {
              name: req.body.name,
              author: req.body.author,
              pages: req.body.pages
            },
            (err, ok) => {
              if(err) throw err;
              return res.json(ok)
            })
          };
        });
});


module.exports = router;
