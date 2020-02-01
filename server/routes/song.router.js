const router = require('express').Router();

//Song Controller
const songController = require('../controllers/songController')

// // Middleware 
const auth = require('../middleware/auth');
const verify = require('../middleware/verifyToken')

// // Add song to user
router.post('/add/:userId', auth.authentication, songController.addSong);

// get user all songs
router.get('/:userId', verify.verifyToken, songController.getSong);

module.exports = router;