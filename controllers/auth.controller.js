const UserModel = require('../models/user.model');
const { signUpErrors, signInErrors } = require('../utils/errors.utils');
const jwt = require('jsonwebtoken');

const maxAge = 3 * 24 * 60 * 60 * 1000;

const createToken = (id) => {
    return jwt.sign({id}, process.env.TOKEN_SECRET, {
        expiresIn: maxAge
    });
};

module.exports.signUp = async (req, res) => {
    const { pseudo, email, password, role } = req.body;

    try {
        const user = await UserModel.create({ pseudo, email, password, role });

        res.status(201).json({ user: user });
    } catch(err) {
        return res.status(500).json({
            message: err.message,
            success: false
        });
    }
};

module.exports.signIn = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await UserModel.login(email, password);
        const token = createToken(user._id);

        res.cookie('jwt', token, { httpOnly: true, maxAge })
        res.status(200).json({ user: user, token: token });
    } catch (err) {
        return res.status(500).json({
            message: err.message,
            success: false
        });
    }
};

module.exports.logout = async (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    // res.redirect('/');
    res.cookie('token', 'logout', {
        httpOnly: true,
        expires: new Date(Date.now() + 1000),
    });
    res.status(200).json({ msg: 'user logged out!' });
};