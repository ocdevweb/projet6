const sharp = require("sharp");
const fs = require('node:fs/promises');
const path = require('path')

var Book = require('../../server/models/Book');

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
    .sort({ averageRating: -1 })
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

rating = function (req, res) {
  let id = req.params.id

  const { userId, rating } = req.body

  Book.findOneAndUpdate({ _id: id },
    [{
      $set: {
        "ratings": {
          $cond: {
            "if": { "$in": [userId, "$ratings.userId"] },
            "then": "$ratings",
            "else": { "$concatArrays": ["$ratings", [{ "userId": userId, "grade": rating }]] }
          }
        }
      }
    }],
    { new: true }
  )
    .then(book => {
      return res.json(book);
    })
    .catch((error) => {
      return res.status(401).send(error);
    });
}



deleteBook = function (req, res) {
  let id = req.params.id

  Book.findOneAndDelete({ _id: id })
    .then(book => {
      return fs.unlink(path.resolve("uploads/" + book.imageUrl.substring(book.imageUrl.lastIndexOf("/") + 1)))
    })
    .then(() => res.status(200).json({ message: 'Livre supprimmé avec succés.' }))
    .catch((error) => {
      return res.status(401).send(error);
    });
}

postBook = function (req, res) {
  const book = req.body.book;

  const webpFile = makeid(10) + ".webp"

  var bookDb = new Book(JSON.parse(book));
  bookDb.imageUrl = `${req.protocol}://${req.get('host')}/uploads/${webpFile}`
  const buffer = req.file.buffer

  sharp(buffer)
    .webp({ quality: 20 })
    .toFile("uploads/" + webpFile)
    .then(res => bookDb.save())
    .then(book => {
      return res.status(200).json({ message: 'Livre ajouté avec succès.' });
    })
    .catch(error => {
      return res.status(500).send(error);
    });
}

putBook = async function (req, res) {
  var book
  let id = req.params.id

  if (req.file) {
    book = JSON.parse(req.body.book);
    const webpFile = makeid(10) + ".webp"
    book.imageUrl = `${req.protocol}://${req.get('host')}/uploads/${webpFile}`
    const buffer = req.file.buffer
    await sharp(buffer)
      .webp({ quality: 20 })
      .toFile("uploads/" + webpFile)

    book = book;
  }
  else {
    book = req.body
  }

  Book.findByIdAndUpdate(id, book)
    .then(bookDb => {
      if (book.imageUrl && bookDb.imageUrl) {
        return fs.unlink(path.resolve("uploads/" + bookDb.imageUrl.substring(bookDb.imageUrl.lastIndexOf("/") + 1)))
      }
    })
    .then(() => {
      return res.status(200).json({ message: 'Livre modifié avec succès.' });
    })
    .catch(error => {
      return res.status(500).send(error);
    });
}

function makeid(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

module.exports = {
  getBooks,
  getBook,
  postBook,
  bestrating,
  deleteBook,
  rating,
  putBook
}