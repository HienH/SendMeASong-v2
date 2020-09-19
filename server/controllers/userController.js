const { User } = require('./../models/user.model');
const { friendSongs } = require('../models/friendSongs.model');

var ObjectID = require('mongodb').ObjectID;
const jwt = require('jsonwebtoken');

module.exports.getUser = (req, res) => {
    const user = new ObjectID(res.locals.userId);
    User.findById(user).populate('songs').populate('friendSongs').populate('playlistHistory')
        .then(user => res.status(200).json({
            user: user
        }))
        .catch(err => res.status(400).json('Error:' + err));
};

// module.exports.getFriendPlaylist = (req, res) => {
//     const playlist = new ObjectID(res.locals.userId);
//     User.findById(playlist)
// }

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
                message: "playlist already exist",
                sucess: false
            })
        }
    })

};

module.exports.login = (req, res) => {
    console.log('inhere')
    // Find email
    User.findOne({ 'email': req.body.email }, (err, user) => {
        if (!user) return res.json({
            loginSuccess: false,
            message: 'Email not found'
        })

        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch) return res.status(404).json({
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

module.exports.saveFriendSongs = async (req, res) => {
    console.log('here')
    const id = req.body.formId

    const name = req.body.name;
    const songs = req.body.songs;
    const newFriendSongs = new friendSongs({
        name,
        songs
    });

    const user = await User.findOne({ 'formId': id });
    console.log(user)

    await newFriendSongs.save();
    user.friendSongs.push(newFriendSongs);
    await user.save();

    res.status(200).json(user);
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

module.exports.getAllUsers = (req, res) => {

    User.find().populate()
        .then(users => res.status(200).json({
            users: users
        }))
        .catch(err => res.status(400).json('Error:' + err));
}

module.exports.getOtherUserSong = (req, res) => {
    const username = req.params.username;

    User.find({ username: username }).populate('songs')
        .then(userInfo => res.status(200).json({
            user: userInfo
        }))
        .catch(err => res.status(400).json('Error:' + err));
}
