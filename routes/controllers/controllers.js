const jwt = require('jsonwebtoken');
var querystring = require('querystring');
var http = require('http');
var express = require('express');
var router = express.Router();
const multer = require('multer')
const storage = multer.memoryStorage();
const upload = multer({ storage });

var Book = require('../../server/models/Book');
var User = require('../../server/models/User');

login = async function (req, res) {
  const { email, password } = req.body;

  let jwtKey = process.env.JWT_SECRET_KEY;

  User.findOne({ email: email })
    .then(user => {
      if (!user || !user.password || !user.validPassword(password)) {
        return res.status(401).json({ message: 'Wrong credentials' });
      } else {
        const token = jwt.sign({ id: user._id.toString(), email: email }, jwtKey);

        res.json({ token: token, userId: user._id.toString() });
      }
    })
    .catch((error) => {
      return res.status(401).send(error);
    });
}

signup = async function (req, res) {
  const { email, password } = req.body;

  var user = new User({
    email: email,
  });

  user.password = user.generateHash(password);
  user.save()
    .then( user => {
      return res.status(200).json({ message: 'Utilisateur crée avec succès.' });
    })
    .catch(error => {
      return res.status(401).send(error);
    });
}

getBooks = function (req, res) {
  Book.find({})
  .then(books => {
      res.json(books);
  })
  .catch((error) => {
    return res.status(401).send(error);
  });
}

bestrating = function (req, res) {
  Book.find()
  .sort({ averageRating: -1})
  .limit(3)
  .then(books => {
      res.json(books);
  })
  .catch(error => {
    return res.status(401).send(error);
  });
}

getBook = function (req, res) {
  let id = req.params.id

  Book.findOne({ _id: id })
  .then(book => {
      return res.json(book);
  })
  .catch((error) => {
    return res.status(401).send(error);
  });
}

deleteBook = function (req, res) {
  let id = req.params.id

  Book.deleteOne({ _id: id })
  .then(book => {
      return res.status(200).json({ message: 'Livre supprimmé avec succés.'});
  })
  .catch((error) => {
    return res.status(401).send(error);
  }); 
}

postBook = function (req, res) {
  const book = req.body.book;

  var bookDb = new Book(JSON.parse(book));
  bookDb.imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`

  bookDb.save()
    .then( book => {
      return res.status(200).json({ message: 'Livre ajouté avec succès.' });
    })
    .catch(error => {
      return res.status(401).send(error);
    });
}

module.exports = {
  login,
  signup,
  getBooks,
  getBook,
  postBook,
  bestrating,
  deleteBook
}