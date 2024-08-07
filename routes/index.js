const jwt = require('jsonwebtoken');
var express = require('express');
var router = express.Router();
const multer = require('multer')
const storage = multer.memoryStorage();
const { getBooks, getBook, postBook, bestrating, deleteBook, rating, putBook } = require('./controllers/books')
const { login, signup } = require('./controllers/users')

var Book = require('../server/models/Book');
var User = require('../server/models/User');

module.exports = router;

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
    const decoded = jwt.verify(token, jwtKey);
  } catch (error) {
    return res.status(400).send(error);
  }

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

