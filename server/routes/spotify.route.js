express = require('express');

const router = express.Router();

// SpotifyController
const spotifyController = require('../controllers/spotifyAPI');
const verifyToken = require('../middleware/verifyToken');
const refreshSpotify = require('../middleware/refreshSpotify');

// create playllist
router.post('/createPlaylist', verifyToken.verifyToken, spotifyController.createSpotifyPlaylist);

// add song
router.post('/addToPlaylist', refreshSpotify.refreshSpotify, spotifyController.addSong);

module.exports = router;