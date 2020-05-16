express = require('express');

const router = express.Router();

// SpotifyController
const spotifyController = require('../controllers/spotifyAPI');
const verifyToken = require('../middleware/verifyToken');
const refreshSpotify = require('../middleware/refreshSpotify');

// Sign in Spotify
router.post('/signIn', verifyToken.verifyToken, spotifyController.loginSpotify);

// create playllist
router.get('/create', verifyToken.verifyToken, refreshSpotify.refreshSpotify, spotifyController.createSpotifyPlaylist);

module.exports = router;