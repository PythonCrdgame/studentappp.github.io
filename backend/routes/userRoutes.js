const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Authentication routes
router.post('/register', userController.register);
router.post('/login', userController.login);

// User routes
router.get('/all', userController.getAllUsers);
router.get('/:userId', userController.getUserById);

// Class routes
router.get('/classes/all', userController.getClasses);

// Enrollment routes
router.post('/enroll', userController.enrollInClass);
router.post('/unenroll', userController.unenrollFromClass);

module.exports = router;
