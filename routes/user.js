const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
const verifyPassword = require('../middleware/verifyPassword');
const verifyEmail = require('../middleware/verifyEmail');

router.post('/signup', verifyEmail, verifyPassword, userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;