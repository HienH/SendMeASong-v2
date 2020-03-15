express = require('express');
const router = express.Router();

// SpotifyController
const spotifyController = require('../controllers/spotifyAPI');

// Sign in Spotify
router.post('/signIn', spotifyController.loginSpotify);

module.exports = router;