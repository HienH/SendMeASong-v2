const jwt = require('jsonwebtoken');

module.exports.verifyToken = (req, res, next) => {
    if (!req.headers.token) {
        return res.status(401).send('Unauthorized request');
    }
    let token1 = req.headers.token
    if (token1 == null) {
        return res.status(401).send('Unauthorized token request');
    }
    let payload = jwt.verify(token1, process.env.JWT_SECRET);
    if (!payload) {
        return res.status(401).send('Unauthorized payload request');
    }
    res.locals.userId = payload._id
    next();
}

