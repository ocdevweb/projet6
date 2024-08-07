function cors(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:' + process.env.PORT_FE);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
}

module.exports = {
  cors
}