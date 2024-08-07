const jwt = require('jsonwebtoken');

var User = require('../../server/models/User');

login = function (req, res) {
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

signup = function (req, res) {
  const { email, password } = req.body;

  var user = new User({
    email: email,
  });

  user.password = user.generateHash(password);
  user.save()
    .then(user => {
      return res.status(200).json({ message: 'Utilisateur crée avec succès.' });
    })
    .catch(error => {
      return res.status(401).send(error);
    });
}

module.exports = {
  login,
  signup
}