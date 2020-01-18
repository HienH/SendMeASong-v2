const { Song } = require('../models/song.model');
const { User } = require('./../models/user.model');

module.exports.addSong = async (req, res) => {
  const song = req.body.song;
  const artist = req.body.artist;
  const newSong = new Song({
    song,
    artist
  });
  const { userId } = req.params;
  const user = await User.findById(userId);

  await newSong.save()


  user.songs.push(newSong);
  await user.save();
  res.status(200).json('Song added');

};

module.exports.getSong = (req, res) => {
  const { userId } = req.params;
  User.findById(userId).populate('songs')
    .then(user => res.status(200).json(user.songs))
    .catch(err => res.status(400).json('err:' + err));
}

