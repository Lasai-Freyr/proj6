const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');
const verifyPassword = require('../middleware/verifyPassword');

const rateLimiter = require("../middleware/rateLimiter");

router.post('/signup', verifyPassword, userCtrl.signup);
router.post('/login', rateLimiter, userCtrl.login);

module.exports = router;