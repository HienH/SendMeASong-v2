const mongoose = require('mongoose');

const songSchema = mongoose.Schema({
    song: {
        type: String,
        require: true,
        maxlength: 100
    },
    artist: {
        type: String,
        require: true,
        maxlength: 100
    }
});

const Song = mongoose.model('Song', songSchema);
module.exports = { Song }