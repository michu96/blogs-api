const Blog = require('../models/Blog')

const blogController = {
    read: async (req, res) => {
        try {
            const blogs = await Blog.find()
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
        const now = Date.now()
        const blog = new Blog({
            title: req.body.title,
            shortDescription: req.body.shortDescription,
            description: req.body.description,
            author: req.body.author,
            createdAt: now,
            updatedAt: now,
        })
        try {
            await blog.save()
            res.send({ msg: 'Created new blog', blog })
        } catch (err) {
            res.status(400).send({ error: 'Something went wrong' })
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
}

module.exports = blogController
