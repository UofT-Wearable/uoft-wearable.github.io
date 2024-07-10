const mongoose = require('mongoose');

const emailSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

const Email = mongoose.model('Email', emailSchema);

module.exports = Email;
