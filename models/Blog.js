const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minLength: 5,
        maxLength: 100,
    },
    shortDescription: {
        type: String,
        trim: true,
        maxLength: 250,
        default: null,
    },
    description: {
        type: String,
        required: true,
        trim: true,
        minLength: 5,
        maxLength: 10000,
    },
    author: {
        type: String,
        trim: true,
        minLength: 2,
        maxLength: 100,
        default: 'Anonymous',
    },
    createdAt: {
        type: Date,
        required: true,
        immutable: true,
    },
    updatedAt: {
        type: Date,
        required: true,
    },
})

module.exports = mongoose.model('Blog', blogSchema)
