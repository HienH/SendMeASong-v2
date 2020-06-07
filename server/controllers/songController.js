const { Song } = require('../models/song.model');
const { User } = require('./../models/user.model');
var ObjectID = require('mongodb').ObjectID;

module.exports.addSong = async (req, res) => {
    const song = req.body.song;
    const artist = req.body.artist;
    const newSong = new Song({
        song,
        artist
    });
    const userId = new ObjectID(res.locals.userId);
    const user = await User.findById(userId);
    await newSong.save()
    user.songs.push(newSong);
    await user.save();
    res.status(200).json('Song added');

};

module.exports.getSong = (req, res) => {
    const userId = new ObjectID(res.locals.userId);
    User.findById(userId).populate('songs')
        .then(user => res.status(200).json(
            user.songs))
        .catch(err => res.status(400).json('err:' + err));
}

module.exports.deleteSong = async (req, res) => {
    const userId = new ObjectID(res.locals.userId);
    const user = await User.findById({
        _id: userId,
    })
    let song = user.songs.indexOf(req.body._id);
    if (song !== -1) { user.songs.splice(song, 1); }
    await user.save();
    res.status(200).json({ message: 'Song deleted' });

}