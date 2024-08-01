const jwt = require('jsonwebtoken');
var querystring = require('querystring');
var http = require('http');
var express = require('express');
var router = express.Router();
const multer = require('./middleware/multer-config');
const { login, signup, getBooks, getBook, postBook, bestrating, deleteBook } = require('./controllers/controllers')

var Book = require('../server/models/Book');
var User = require('../server/models/User');

router.get('/', async function (req, res, next) {
  let newUser = await insertUserData();
  let newBooks = await insertBookData(newUser._id.toString())

  var post_data = querystring.stringify({
    'email': newUser.email,
    'password': "uzbubz%&onoin2ß09kjn",
  });

  var post_options = {
    host: 'localhost',
    port: '80',
    path: '/api/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(post_data)
    }
  };

  var post_req = http.request(post_options, function (res) {
    res.setEncoding('utf8');

    res.on('data', async function (data) {
      const response = JSON.parse(data);

      console.log(response);
    });
  });
  post_req.write(post_data);
  post_req.end();

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
    },
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


router.post('/api/auth/login', login);

router.post('/api/auth/signup', signup);

router.get('/api/books/bestrating', bestrating);

router.get('/api/books/:id', getBook);

router.get('/api/books', getBooks);

router.post('/api/books', multer, postBook);

router.delete('/api/books/:id', deleteBook);


function auth(req, res, next) {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ message: 'Authentication failed' });

  try {
    const decoded = jwt.verify(token, secretKey);
    next();
  } catch (error) {
    res.status(400).error(error);
  }
};

