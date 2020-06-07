const router = require('express').Router();

//Song Controller
const songController = require('../controllers/songController')

// // Middleware 
const auth = require('../middleware/auth');
const verify = require('../middleware/verifyToken')

// // Add song to playlist
router.post('/add', verify.verifyToken, songController.addSong);

// get playlist all songs
router.get('', verify.verifyToken, songController.getSong);

// delete a song
router.post('/delete', verify.verifyToken, songController.deleteSong);
module.exports = router;