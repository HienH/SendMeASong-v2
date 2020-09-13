express = require('express');
const router = express.Router();

// UserController
const userController = require('../controllers/userController')
// Middleware 
const auth = require('../middleware/auth')
const verifyToken = require('../middleware/verifyToken');


// add playlist
router.post('/register', userController.register);

// playlist login
router.post('/login', userController.login);

// playlist logout
router.get('/logout', userController.logout);

// // get all users
// router.get('/users', userController.getAllUsers);

// // get other playlist songs
// router.get('/otherUser/:username', userController.getOtherUserSong);

// get user details
router.get('/info', verifyToken.verifyToken, userController.getUser);

// add friends playlist
router.post('/addFriendSongs', userController.saveFriendSongs);


// get playlist friends playlist
// router.get('/friendsPlaylist', verifyToken.verifyToken, userController.getFriendPlaylist);

// //get all playlist songs
// router.get('/:userId', (async (req, res) => {
//   const { userId } = req.params;
//   User.findById(userId).populate('songs')
//     .then(users => res.status(200).json(users))
//     .catch(err => res.status(400).json('Error:' + err));

// }));

// // get all users and songs
// router.get('/', (req, res) => {
//   User.find().populate('songs')
//     .then(users => res.status(200).json(users))
//     .catch(err => res.status(400).json('Error:' + err));
// });


module.exports = router; 
