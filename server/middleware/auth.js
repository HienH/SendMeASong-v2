const { User } = require('./../models/user.model');

module.exports.authentication = (req, res, next) => {
  let token = req.cookies.auth;
  User.findByToken(token, (err, user) => {
    if (err) throw err;
    if (!user) return res.json({
      isAuth: false,
      error: true
    });
    req.token = token;
    req.user = user;
    next();
  })
}

