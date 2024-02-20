const express = require('express');
const { registerUser, authenticateUser } = require('../controllers/userController');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', authenticateUser);

module.exports = router;
