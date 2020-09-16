const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userControllers')
const secret_entry = require('../utils/secret')

router.post('/sign-up', secret_entry,  UserController.signUp);
router.post('/authenticate', secret_entry,  UserController.login);


module.exports = router;