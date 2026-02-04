const express = require('express');
const router = express.Router();
const { createFeedback, getFeedback } = require('../controllers/feedbackController');

router.route('/').post(createFeedback).get(getFeedback);

module.exports = router;
