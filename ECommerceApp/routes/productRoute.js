const express = require('express')
const productController = require('../controllers/productController')
const router = express.Router()
const authenticate = require('../auth')

router.get('/getProducts', productController.getProducts)
router.post('/createProduct', authenticate, productController.createProduct)
router.put('/editProduct/:id', authenticate, productController.editProduct)
router.delete('/deleteProduct/:id', authenticate, productController.deleteProduct)

module.exports = router