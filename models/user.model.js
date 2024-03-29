const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
    {
        pseudo: {
            type: String,
            required: [true, 'Please provide pseudo'],
            minlength: 3,
            maxlength: 50,
            unique: true,
            trim: true
        },
        email: {
            type: String,
            unique: true,
            required: [true, 'Please provide email'],
            validate: {
                validator: validator.isEmail,
                message: 'Please provide valid email',
            },
            lowercase: true,
            trim: true
        },
        image: {
            type: String,
            required: false,
        },
        password: {
            type: String,
            required: [true, 'Please provide password'],
            max: 1024,
            minlength: 6
        },
        role: {
            type: String,
            default: "user",
            enum: ["user", "admin"]
        },
        verificationCode: {
            type: Number,
        },
        isEmailVerified: {
            type: Boolean,
            default: false,
        },
        passwordResetCode: {
            type: String,
        }
    },
    {
        timestamps: true,
    }
);

// play function before save into display: 'block'
userSchema.pre("save", async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.statics.login = async function(email, password) {
    const user = await this.findOne({ email });

    if (user) {
        const auth = await bcrypt.compare(password, user.password);

        if(auth) {
            return user;
        }
        throw Error('Incorrect password !');
    }
    throw Error('Incorrect email !');
};


const UserModel = mongoose.model('user', userSchema);

module.exports = UserModel;