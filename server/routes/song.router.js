const router = require('express').Router();

//Song Controller
const songController = require('../controllers/songController')

// // Middleware 
const auth = require('../middleware/auth');

// // Add song to user
router.post('/add/:userId', auth.authentication, songController.addSong);

// get user all songs
router.get('/:userId', auth.authentication, songController.getSong);

module.exports = router;