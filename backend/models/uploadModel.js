const mongoose = require('mongoose');

// schema describing a post in db
const uploadSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        imagepath: { type: String, required: true }, 
        caption: {type: String, required: true },
        location: { type: String, required: true }, // city, state, country? coordinates?
    },
    {
        timestamps: true
    },
    { collection: 'uploads' }
);

const model = mongoose.model('upload', uploadSchema);

module.exports = model;
