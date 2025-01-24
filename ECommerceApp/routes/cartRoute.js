const express = require('express')
const cartController = require('../controllers/cartController')
const router = express.Router()
const authenticate = require('../auth')

router.get('/getCart', authenticate, cartController.getCart)
router.post('/addProducts', authenticate, cartController.addProducts)

module.exports = router