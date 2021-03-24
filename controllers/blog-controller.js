const multer = require('multer')
const jimp = require('jimp')
const fs = require('fs')
const Blog = require('../models/Blog')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads')
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.fieldname}-${Date.now()}.${file.originalname.split('.')[1]}`
    )
  },
})
const upload = multer({
  storage: storage,
})

const blogController = {
  read: async (req, res) => {
    try {
      const blogs = await Blog.find().sort({ createdAt: 'desc' }).limit(15)
      res.send(blogs)
    } catch (err) {
      res.status(500).send({
        error: '500 Internal Server Error',
      })
    }
  },
  readOne: async (req, res) => {
    // Check if given id is ObjectId format
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      try {
        const blog = await Blog.findById(req.params.id)
        if (blog === null) {
          res.status(404).send({ error: '404 Not Found' })
          return
        }
        res.send(blog)
      } catch (err) {
        res.status(500).send({ error: '500 Internal Server Error' })
      }
    } else {
      res.status(400).send({
        error: 'Invalid format of ID. Expected ObjectId',
      })
    }
  },
  insert: async (req, res) => {
    console.log(req.file)
    if (!req.file) {
      res.status(400).send({ errors: { image: 'Image is required' } })
      return
    }
    const now = Date.now()
    const blog = new Blog({
      title: req.body.title,
      img: {
        data: fs.readFileSync(`uploads/${req.file.filename}`),
        contentType: req.file.mimetype,
      },
      smImg: {
        data: fs.readFileSync(`uploads/sm-${req.file.filename}`),
        contentType: req.file.mimetype,
      },
      shortDescription: req.body.shortDescription,
      description: req.body.description,
      author: req.body.author,
      createdAt: now,
      updatedAt: now,
    })
    try {
      await blog.save()
      res.status(201).send({ msg: 'Created new blog', blog })
    } catch (err) {
      if (err.errors) {
        res.status(400).send({ errors: err.errors })
        return
      }
      console.log(err)
      res.status(500).send({ error: 'Internal server error. Try again later.' })
    }
  },
  edit: async (req, res) => {
    // Check if given id is ObjectId format
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      const now = Date.now()
      try {
        const blog = await Blog.findByIdAndUpdate(
          req.params.id,
          {
            ...req.body,
            updatedAt: now,
          },
          { new: true, runValidators: true }
        )
        if (blog === null) {
          res.status(404).send({ error: '404 Not Found' })
          return
        }
        res.send({ msg: 'Blog edited successfully', blog })
      } catch (err) {
        res.status(400).send({
          error: 'Something went wrong',
        })
      }
    } else {
      res.status(400).send({
        error: 'Invalid format of ID. Expected ObjectId',
      })
    }
  },
  remove: async (req, res) => {
    // Check if given id is ObjectId format
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      try {
        const blog = await Blog.findByIdAndDelete(req.params.id)
        if (blog === null) {
          res.status(404).send({ error: '404 Not Found' })
          return
        }
        res.send({ msg: 'Blog deleted successfully', blog })
      } catch (err) {
        res.status(400).send({ error: 'Something went wrong' })
      }
    } else {
      res.status(400).send({
        error: 'Invalid format of ID. Expected ObjectId',
      })
    }
  },
  uploadImg: upload.single('image'),
  resizeImg: (req, res, next) => {
    if (!req.file) {
      res
        .status(400)
        .send({ errors: { image: 'Cannot resize. Image is missing' } })
      return
    }
    jimp
      .read(`uploads/${req.file.filename}`)
      .then((img) => {
        img.resize(jimp.AUTO, 250)
        img.write(`uploads/sm-${req.file.filename}`, () => {
          next()
        })
      })
      .catch((err) => {
        res.status(500).send({ error: '500 Internal Server Error' })
        return
      })
  },
}

module.exports = blogController
