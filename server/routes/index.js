var express = require('express');
var router = express.Router();
const mongoose = require("mongoose");
const Books = require("../models/Books");
const Posts = require("../models/Posts");
const Useres = require('../models/Users');
//For authentication:
const jwt = require('jsonwebtoken');
const validateToken = require('../auth/validateToken.js');
const bcrypt = require('bcryptjs');
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


router.get('/api/posts/', function(req,res,next) {

  Posts.find({}, function(err, posts) {
    if(err) {
      console.log(err);
      throw err
    } else {
      res.json(posts)
    }
  })


})

router.post('/api/codepost/', validateToken, function(req, res, next) {
  console.log(req.body)
    Posts.create(
      {
        name: req.body.name,
        content: req.body.content,
        userid: req.body.userid,
        likes: 0,
        comments: []
      },
      (err, ok) => {
        if(err) throw err;
        return res.json(ok)
      })
  });

  router.post('/api/codecomment/', validateToken, function(req, res, next) {
    console.log(req.body)
    Posts.findOne({_id: req.body._id}, (err, post) => {
      if(err) {
        console.log(err);
        throw err
      };
      if(post){
        console.log(post.comments)
        let comment = {
          text: req.body.comment,
          user: req.body.user,
          userid: req.body.userid

        }
        console.log(post.comments)
        console.log(comment)
        post.comments.push(comment);
        post.save()
        return res.json(post)
      } 
    });
  })

  router.post('/api/codevote/', validateToken, function(req, res, next) {
    console.log(req.body)
    Posts.findOne({_id: req.body._id}, (err, post) => {
      if(err) {
        console.log(err);
        throw err
      };
      if(post){
        post.likes = post.likes + req.body.vote;
        post.save()
        return res.json(post)
      } 
    });
  })

  router.post('/api/editpost/', validateToken, function(req, res, next) {
    console.log(req.body)
    Posts.findOne({_id: req.body._id}, (err, post) => {
      if(err) {
        console.log(err);
        throw err
      };
      if(post){
        post.content = req.body.content;
        post.save()
        return res.json(post)
      } 
    });
  })
    
module.exports = router;
