const UserModel = require('../models/user.model');
const { StatusCodes } = require('http-status-codes');
const ObjectID = require('mongoose').Types.ObjectId;

module.exports.getAllUsers = async (req, res) => {
    const users = await UserModel.find().select('-password');

    res.status(StatusCodes.OK).json({ users });
};

module.exports.getSingleUser = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(StatusCodes.BAD_REQUEST).send('ID unknown : ' + req.params.id);
    }

    const user = await UserModel.findOne({ _id: req.params.id }).select('-password');

    res.status(StatusCodes.OK).json({ user });
};

module.exports.updateUser = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(StatusCodes.BAD_REQUEST).send('ID unknown : ' + req.params.id);
    }

    try {
        const { pseudo, email } = req.body;

        const user = await UserModel.findOne({ _id: req.params.id });

        user.pseudo = pseudo;
        user.email = email;

        await user.save();

        res.status(StatusCodes.OK).json({ user });
    } catch (err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err });
    }
};

module.exports.deleteUser = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(StatusCodes.BAD_REQUEST).send('ID unknown : ' + req.params.id);
    }

    try {
        await UserModel.deleteOne({ _id: req.params.id }).exec();

        res.status(StatusCodes.OK).json({ message: "Successfully deleted." });
    } catch (err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err });
    }
}