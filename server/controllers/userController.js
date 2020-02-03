const { User } = require('./../models/user.model');
var ObjectID = require('mongodb').ObjectID;


module.exports.getUser = (req, res) => {
    const user = new ObjectID(res.locals.userId);
    User.findById(user).populate('songs')
        .then(user => res.status(200).json({
            user: user
        }))
        .catch(err => res.status(400).json('Error:' + err));

};

module.exports.register = (req, res) => {
    const newUser = new User();
    newUser.email = req.body.email;
    newUser.password = req.body.password;
    newUser.username = req.body.username;

    User.findOne({ 'email': req.body.email }, (err, user) => {
        if (!user) {
            newUser.save((err, doc) => {
                if (err) {
                    console.log(err);
                    res.json({
                        sucess: false, err: err
                    })
                }
                else {
                    res.status(200).json({
                        succuss: true,
                        userData: doc
                    })
                };
            });
        }
        else {
            res.status(409).json({
                message: "user already exist",
                sucess: false
            })
        }


    })

};

module.exports.login = (req, res) => {
    // Find email
    User.findOne({ 'email': req.body.email }, (err, user) => {
        if (!user) return res.json({
            loginSuccess: false,
            message: 'Email not found'
        })

        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch) return res.json({
                message: "wrong password",
                token: "no token"
            });
            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err);
                res.cookie('auth', user.token).status(200).json({
                    loginSuccess: true,
                    message: 'welcome',
                    token: user.token,
                    user: user
                })
            })
        })
    })
}

module.exports.logout = (req, res) => {
    const user = new ObjectID(res.locals.userId);
    User.findByIdAndUpdate(
        { _id: user },
        { token: '' },
        (err, doc) => {
            if (err) return res.json({
                success: false,
                error: err
            });
            return res.status(200).send({
                success: true
            })
        }
    )
};

module.exports.isLoggedin = (req, res) => {
    User.findByToken(req.body.token, (err, user) => {
        if (!user) return res.status(400).json({
            token: 'invalid'
        }); else {
            return res.status(200)
        }

    })
}