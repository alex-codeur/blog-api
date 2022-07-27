const UserModel = require('../models/user.model');
const { signUpErrors, signInErrors } = require('../utils/errors.utils');
const jwt = require('jsonwebtoken');
const crypto = require("crypto");
const bcrypt = require('bcrypt');

const maxAge = 3 * 24 * 60 * 60 * 1000;

const createToken = (id) => {
    return jwt.sign({id}, process.env.TOKEN_SECRET, {
        expiresIn: maxAge
    });
};

module.exports.signUp = async (req, res) => {
    const code = crypto.randomInt(100000, 1000000);
    req.body.verificationCode = code;
    const { pseudo, email, password, role, verificationCode } = req.body;

    try {
        const user = await UserModel.create({ pseudo, email, password, role, verificationCode });

        return res.status(201).json({
            message: "Account successfully created",
            success: true,
            user: user
        });
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

        return res.status(201).json({
            message: "Login success",
            success: true,
            user: user,
            token: token
        });
    } catch (err) {
        return res.status(500).json({
            message: err.message,
            success: false
        });
    }
};

module.exports.verify = async (req, res) => {
    try {
        let { verificationCode } = req.body;
        const user = await UserModel.findOne({ verificationCode });

        if (!user) {
            return res.status(404).json({
                message: "Invalid code",
                success: false,
            });
        } else if(user.isEmailVerified) {
            return res.status(404).json({
                message: "Email already verified",
                success: false,
            });
        }

        await UserModel.updateOne({ isEmailVerified: true });

        return res.status(201).json({
            message: "Email verification success",
            success: true,
        });
    } catch (err) {
        return res.status(500).json({
            message: err.message,
            success: false
        });
    }
};

module.exports.forgotPassword = async (req, res) => {
    try {
        let { email } = req.body;
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "Invalid email",
                success: false,
            });
        }

        const code = crypto.randomInt(100000, 1000000);
        const passwordResetCode = await bcrypt.hash(code.toString(), 16);

        await UserModel.updateOne({ passwordResetCode: passwordResetCode });

        return res.status(201).json({
            message: "Verification code sent to your email",
            success: true,
        });
    } catch (err) {
        return res.status(500).json({
            message: err.message,
            success: false
        });
    }
};

module.exports.resetPassword = async (req, res) => {
    try {
        let { email, code, newPassword } = req.body;
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "Invalid email",
                success: false,
            });
        }

        let isMatch = await bcrypt.compare(code.toString(), user.resetPassword);

        if (isMatch) {
            const hashedPassword = await bcrypt.hash(newPassword, 16);

            await UserModel.updateOne({ password: hashedPassword }, { passwordResetCode: "" });
            
            return res.status(201).json({
                message: "Your password has been successfully reset",
                success: true,
            });
        } else {
            return res.status(404).json({
                message: "Invalid code",
                success: false
            });
        }

    } catch (err) {
        return res.status(500).json({
            message: err.message,
            success: false
        });
    }
};

module.exports.changePassword = async (req, res) => {
    try {
        let { oldPassword, newPassword } = req.body;
        const user = await UserModel.findById(req.user._id);

        let isMatch = await bcrypt.compare(oldPassword, user.password);

        if (isMatch) {
            const hashedPassword = await bcrypt.hash(newPassword, 16);

            await UserModel.updateOne({ password: hashedPassword });
            
            return res.status(201).json({
                message: "Your password has been successfully reset",
                success: true,
            });
        } else {
            return res.status(404).json({
                message: "Your old password is incorrect",
                success: false
            });
        }

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

