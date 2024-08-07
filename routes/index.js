const jwt = require('jsonwebtoken');
var querystring = require('querystring');
var http = require('http');
var express = require('express');
var router = express.Router();
const multer = require('multer')
const storage = multer.memoryStorage();
const { getBooks, getBook, postBook, bestrating, deleteBook, rating, putBook } = require('./controllers/books')
const { login, signup } = require('./controllers/users')

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

router.post('/api/books', auth, multer({ storage: storage }).single('image'), postBook);

router.put('/api/books/:id', authId, multer({ storage: storage }).single('image'), putBook);

router.delete('/api/books/:id', authId, deleteBook);

router.post('/api/books/:id/rating', auth, rating);


function auth(req, res, next) {
  var token = req.header('Authorization').toString();
  if (!token) return res.status(401).json({ message: 'Authentication failed' });

  token = token.replace(/^\s*Bearer\s*/, "")
  let jwtKey = process.env.JWT_SECRET_KEY;

  try {
    console.log("auth: try")
    const decoded = jwt.verify(token, jwtKey);
  } catch (error) {
    console.log("auth: catch")
    return res.status(400).send(error);
  }
  console.log("auth: next")
  next();
};

function authId(req, res, next) {
  var token = req.header('Authorization');

  token = token.replace(/^\s*Bearer\s*/, "")
  if (!token) return res.status(401).json({ message: 'Authentication failed' });

  var decoded
  let id = req.params.id
  let jwtKey = process.env.JWT_SECRET_KEY;

  try {
    decoded = jwt.verify(token, jwtKey);
  } catch (error) {
    res.status(400).send(error);
  }

  Book.findById(id)
    .then(book => {
      if (book.userId != decoded.id) {
        throw new Error("Modification restricted to owner of resource.")
      }
    })
    .then(() => next())
    .catch((error) => {
      if (error.message == "Modification restricted to owner of resource.") {
        res.status(403).send(error);
      } else {
        res.status(500).send(error);
      }
    });
};

