const express = require('express');
const router = express.Router();
const { syncUser, getUser, lookupUserByMobile } = require('../controllers/userController');

router.post('/sync', syncUser);
router.post('/lookup', lookupUserByMobile);
router.get('/:uid', getUser);

module.exports = router;
