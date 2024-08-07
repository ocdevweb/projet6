const jwt = require('jsonwebtoken');
var Book = require('../server/models/Book');

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

module.exports = {
  auth,
  authId
}