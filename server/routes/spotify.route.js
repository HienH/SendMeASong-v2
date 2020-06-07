express = require('express');

const router = express.Router();

// SpotifyController
const spotifyController = require('../controllers/spotifyAPI');
const verifyToken = require('../middleware/verifyToken');
const refreshSpotify = require('../middleware/refreshSpotify');

// create playllist
router.get('/createPlaylist', verifyToken.verifyToken, spotifyController.createSpotifyPlaylist);

// add song
router.post('/addToPlaylist', verifyToken.verifyToken, refreshSpotify.refreshSpotify, spotifyController.addSong);


module.exports = router;