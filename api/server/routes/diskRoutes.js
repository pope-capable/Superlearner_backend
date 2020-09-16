const express = require('express');
const router = express.Router();
const DiskControllers = require('../controllers/diskController')
const entry = require('../utils/security')

router.get('/get-usage/:userId', entry,  DiskControllers.getUserDisk);
router.post('/update', entry,  DiskControllers.updateDiskUsage);


module.exports = router;