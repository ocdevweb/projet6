var express = require('express');
var router = express.Router();

var Book = require('../server/models/Book');
var User = require('../server/models/User');

router.get('/', async function (req, res, next) {
  let newUser = await insertUserData();
  let newBooks = await insertBookData(newUser._id.toString())

  res.send(JSON.stringify(newBooks));
});

module.exports = router;


function insertUserData() {
  var user = new User({
    email: "pierrepaul@gmail.com",
  });

  user.password = user.generateHash("uzbubz%&onoin2ß09kjn");

  return user.save();
};


function insertBookData(userId) {
  return Book.insertMany([
     {
       title: "titre 2",
       author: "james hite",
       userId: userId,
     } ,
     {
      title: "titre 1",
      author: "james hite",
      userId: userId,
    },
    {
      title: "titre 3",
      author: "james hite",
      userId: userId,
    } 
  ]);
}