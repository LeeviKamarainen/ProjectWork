var express = require('express');
var router = express.Router();
const mongoose = require("mongoose");
const Books = require("../models/Books");
const Posts = require("../models/Posts");
const Users = require('../models/Users');
const { ObjectId } = require('mongodb');
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
  let date = new Date();
  console.log(date.toLocaleString())
    Posts.create(
      {
        name: req.body.name,
        content: req.body.content,
        edited: date.toLocaleString(),
        userid: req.body.userid,
        likes: {
          users: [],
          votes: []
        },
        comments: []
      },
      (err, ok) => {
        if(err) throw err;
        return res.json(ok)
      })
  });

  router.post('/api/codecomment/', validateToken, function(req, res, next) {
    console.log(req.body)
    let date = new Date();
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
          userid: req.body.userid,
          edited: date.toLocaleString(),
          likes: {
            users:[],
            votes:[]
          }
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
        let foundUserIndex = post.likes.users.indexOf(req.body.user)
        console.log(foundUserIndex)
        console.log(post.likes.votes)
        console.log(post.likes.users)
        if(foundUserIndex >= 0) {
          post.likes.votes[foundUserIndex] = req.body.vote;
          post.save()
          return res.json(post)
        } else {
        post.likes.votes.push(req.body.vote);
        post.likes.users.push(req.body.user)
        post.save()
        return res.json(post)
        }
      } 
    });
  })

  router.post('/api/commentvote/', validateToken, function(req, res, next) {
    console.log(req.body)
    Posts.findOne({_id: req.body._id}, (err, post) => {
      if(err) {
        console.log(err);
        throw err
      };
      if(post){
        let commentIndex = req.body.index;
        let foundUserIndex = post.comments[commentIndex].likes.users.indexOf(req.body.user)
        console.log(foundUserIndex)
        if(foundUserIndex >= 0) {
          post.comments[commentIndex].likes.votes[foundUserIndex] = req.body.vote;
          post.save()
          return res.json(post)
        } else {
        post.comments[commentIndex].likes.votes.push(req.body.vote);
        post.comments[commentIndex].likes.users.push(req.body.user)
        post.save()
        return res.json(post)
        }
      } 
    });
  })



  router.post('/api/editpost/', validateToken, function(req, res, next) {
    console.log(req.body)
    let date = new Date();
    Posts.findOne({_id: req.body._id}, (err, post) => {
      if(err) {
        console.log(err);
        throw err
      };
      if(post){
        post.content = req.body.content;
        post.edited = date.toLocaleString()
        post.save()
        return res.json(post)
      } 
    });
  })
    

  router.post('/api/editcomment/', validateToken, function(req, res, next) {
    console.log(req.body)
    let date = new Date();
    Posts.findOne({_id: req.body._id}, (err, post) => {
      if(err) {
        console.log(err);
        throw err
      };
      if(post){
        let commentIndex = req.body.index;
        post.comments[commentIndex].text = req.body.content;
        post.comments[commentIndex].edited = date.toLocaleString()
        post.save()
        return res.json(post)
      } 
    });
  })


  router.post('/api/deletecomment/', validateToken, function(req, res, next) {
    console.log(req.body)
    Posts.findOne({_id: req.body._id}, (err, post) => {
      if(err) {
        console.log(err);
        throw err
      };
      if(post){
        let commentIndex = req.body.index;
        post.comments.splice(commentIndex,1)
        post.save()

      } 
    });
  })

  router.post('/api/deletepost/', validateToken, function(req, res, next) {
    console.log(req.body)
    Posts.findOneAndRemove({_id: req.body._id}, function(err,data) {
      if(err) throw err;
      res.json({delete:"success"})
    })
  })


module.exports = router;
