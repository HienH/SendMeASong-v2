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
    console.log(res.locals.userId)
    console.log('inVerifyJS')

    next();
}

//
//
//
// module.exports.verifyToken = (req, res, next) => {
//     let token = req.cookies.auth;
//     User.findByToken(token, (err, user) => {
//         if (err) throw err;
//         if (!user) return res.json({
//             isAuth: false,
//             error: true
//         });
//         req.token = token;
//         req.user = user;
//         next();
//     })
// }
//
