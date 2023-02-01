const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const isAuth = require('../middleware/is-auth');

router.post('/signin', authController.signIn);

router.post('/login', authController.logIn);

router.get('/users/:userId', isAuth , authController.getUserById);

router.get('/users',isAuth, authController.getUsers);

router.put('/users/:userId', isAuth, authController.updateUser);

module.exports = router; 
