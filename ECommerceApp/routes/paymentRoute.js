const express = require("express");
const router = express.Router()
const authenticate = require('../auth')
const paymentController = require('../controllers/paymentController')

router.post('/checkout', authenticate, paymentController.checkout)

module.exports = router