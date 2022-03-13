const mongoose = require('mongoose');

const User = mongoose.model(
    "User", new mongoose.Schema({
        login:{
            type: String,
            unique: true,
            required: true,
            minlength:1,
            maxlength:255
        },
        password:{
            type: String,
            required: true,
            minlength:1,
            maxlength:255
        },
        role: {
            type: String,
            required: true,
            default: 'user',
            minlength:1,
            maxlength:255
        },
        name:{
            type: String,
            required: false,
            maxlength:255
        },
        surname: {
            type: String,
            required: false,
            maxlength:255
        },
        lastname:{
            type: String,
            required: false,
            maxlength:255
        },
        last_login:{
            type: Date,
            required: false
        },
        login_status:{
            type: Number,
            required: false,
            default: '0',
            max:4
        }
    })
);

module.exports = User;