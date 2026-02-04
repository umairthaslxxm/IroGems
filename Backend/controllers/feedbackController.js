const Feedback = require('../models/Feedback');

// @desc    Create new feedback
// @route   POST /api/feedback
// @access  Public
const createFeedback = async (req, res) => {
    try {
        const { name, email, message, rating } = req.body;

        const feedback = new Feedback({
            name,
            email,
            message,
            rating,
        });

        const createdFeedback = await feedback.save();
        res.status(201).json(createdFeedback);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all feedback
// @route   GET /api/feedback
// @access  Public (Admin)
const getFeedback = async (req, res) => {
    try {
        const feedbacks = await Feedback.find({});
        res.json(feedbacks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createFeedback,
    getFeedback,
};
