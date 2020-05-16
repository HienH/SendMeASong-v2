express = require('express');
const router = express.Router();

// UserController
const userController = require('../controllers/userController')
// Middleware 
const auth = require('../middleware/auth')
const verifyToken = require('../middleware/verifyToken');


// add user 
router.post('/register', userController.register);

// user login
router.post('/login', userController.login);

// user logout
router.get('/logout', userController.logout);

// get all users
router.get('/users', userController.getAllUsers);

// get other user songs
router.get('/otherUser/:username', userController.getOtherUserSong);

// get user songs
router.get('/user', verifyToken.verifyToken, userController.getUser);

// get user info
router.post('/addFriendSongs', userController.saveFriendSongs);














// get user friends playlist
// router.get('/friendsPlaylist', verifyToken.verifyToken, userController.getFriendPlaylist);

// //get all user songs
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
