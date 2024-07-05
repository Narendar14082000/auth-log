const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
    const { name, email, password, dateOfBirth } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ status: 'FAILED', message: 'User already exists' });
        }
        user = new User({
            name,
            email,
            password,
            dateOfBirth
        });
        await user.save();
        res.status(201).json({ status: 'SUCCESS', message: 'Signup successful', data: user });
    } catch (error) {
        res.status(500).json({ status: 'FAILED', message: 'Server error' });
    }
};

exports.signin = async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ status: 'FAILED', message: 'Invalid credentials' });
        }
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(400).json({ status: 'FAILED', message: 'Invalid credentials' });
        }
        const payload = {
            user: {
                id: user.id
            }
        };
        jwt.sign(
            payload,
            'secret',
            { expiresIn: 3600 },
            (err, token) => {
                if (err) throw err;
                res.json({ status: 'SUCCESS', message: 'Signin successful', data: user, token });
            }
        );
    } catch (error) {
        res.status(500).json({ status: 'FAILED', message: 'Server error' });
    }
};
