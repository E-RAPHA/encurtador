const mongoose = require('mongoose');

const linkSchema = new mongoose.Schema({
    LinkAdm: {
        type: String,
        required: true,
    },
    linkGrande: {
        type: String,
        required: true,
    },
    LinkShort: {
        type: String,
        required: true,
        unique: true,
    },
    visits: {
        type: Number,
        default: 0,
    },
}, { collection: 'links' });

const Link = mongoose.model('Link', linkSchema);

module.exports = Link;
