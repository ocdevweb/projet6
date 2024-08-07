var express = require('express');
var router = express.Router();
const multer = require('multer')
const storage = multer.memoryStorage();
const { getBooks, getBook, postBook, bestrating, deleteBook, rating, putBook } = require('./controllers/books')
const { login, signup } = require('./controllers/users')
const { auth, authId } = require('./middleware/auth')

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