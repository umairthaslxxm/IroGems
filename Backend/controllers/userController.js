const User = require('../models/User');

// @desc    Sync Firebase User to MongoDB
// @route   POST /api/users/sync
// @access  Public
const syncUser = async (req, res) => {
    try {
        const { firebaseUid, email, firstName, lastName, accountName, mobile } = req.body;

        // 1. Try finding by Firebase UID
        let user = await User.findOne({ firebaseUid });

        // 2. If not found by UID, try finding by Email (Legacy/Manual Fix support)
        if (!user) {
            user = await User.findOne({ email });
            if (user) {
                // Determine if we need to update the UID (Link existing MongoDB record to new Firebase Login)
                console.log(`Linking existing user ${email} to new UID ${firebaseUid}`);
                user.firebaseUid = firebaseUid;
            }
        }

        if (user) {
            // Update existing user
            user.firstName = firstName || user.firstName;
            user.lastName = lastName || user.lastName;
            user.accountName = accountName || user.accountName;
            user.mobile = mobile || user.mobile;
            user.firebaseUid = firebaseUid; // Ensure UID is set
            await user.save();
            return res.json(user);
        }

        // 3. Create new user
        user = await User.create({
            firebaseUid,
            email,
            firstName,
            lastName,
            accountName,
            mobile
        });

        res.status(201).json(user);
    } catch (error) {
        // Handle duplicate key errors
        if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];
            return res.status(400).json({ message: `A user with this ${field} already exists.` });
        }
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get User by Firebase UID
// @route   GET /api/users/:uid
// @access  Public
const getUser = async (req, res) => {
    try {
        const user = await User.findOne({ firebaseUid: req.params.uid });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get User Email by Mobile Number (for login lookup)
// @route   POST /api/users/lookup
// @access  Public
const lookupUserByMobile = async (req, res) => {
    try {
        const { mobile } = req.body;
        const user = await User.findOne({ mobile });

        if (!user) {
            return res.status(404).json({ message: 'No user found with this mobile number.' });
        }

        res.json({ email: user.email });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    syncUser,
    getUser,
    lookupUserByMobile
};
