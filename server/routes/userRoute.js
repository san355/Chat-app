const express = require('express');
const { loginAndGenerateUserSig } = require('../controllers/userController');
const router = express.Router();

router.post('/login',loginAndGenerateUserSig)


module.exports = router;
