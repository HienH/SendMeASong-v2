const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const friendSongsSchema = mongoose.Schema({
    name: {
        type: String,
        require: true,
        trim: true,
    },
    songs: [{
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
    }],

});

const friendSongs = mongoose.model('friendSong', friendSongsSchema);
module.exports = { friendSongs }