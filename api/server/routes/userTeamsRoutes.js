const express = require('express');
const router = express.Router();
const UserTeamController = require('../controllers/userTeamControlers')
const entry = require('../utils/security')

router.get('/get-joined/:userId', entry,  UserTeamController.getJoinedTeams);
router.get('/get-pending/:userId', entry,  UserTeamController.getPendingTeams);


module.exports = router;