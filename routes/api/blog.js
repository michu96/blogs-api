const express = require('express')
const blogController = require('../../controllers/blog-controller')

const router = express.Router()

router.get('/', blogController.read)
router.get('/:id', blogController.readOne)
router.post(
  '/',
  blogController.uploadImg,
  blogController.resizeImg,
  blogController.insert
)
router.put('/:id', blogController.edit)
router.delete('/:id', blogController.remove)

module.exports = router
