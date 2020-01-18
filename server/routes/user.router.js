express = require('express');
const router = express.Router();

// UserController
const userController = require('../controllers/userController')
// Middleware 
const auth = require('../middleware/auth')


// add user 
router.post('/register', userController.register);

// user login
router.post('/login', userController.login);


// user logout
router.get('/logout', auth.authentication, userController.logout);

//get all user songs
router.get('/:userId', auth.authentication, userController.getUser);


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
