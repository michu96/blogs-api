const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title cannot be empty'],
    trim: true,
    minLength: [5, 'Title must be at least 5 characters long'],
    maxLength: [100, 'Title cannot be longer than 100 characters'],
  },
  img: {
    data: Buffer,
    contentType: String,
  },
  smImg: {
    data: Buffer,
    contentType: String,
  },
  shortDescription: {
    type: String,
    trim: true,
    maxLength: [250, 'Short description cannot be longer than 250 characters'],
    default: null,
  },
  description: {
    type: String,
    required: [true, 'Description cannot be empty'],
    trim: true,
    minLength: [5, 'Description must be at least 5 characters long'],
    maxLength: [10000, 'Description cannot be longer than 10000 characters'],
  },
  author: {
    type: String,
    trim: true,
    minLength: [2, 'Author name must be at least 2 characters long'],
    maxLength: [100, 'Author name cannot be longer than 100 characters'],
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
