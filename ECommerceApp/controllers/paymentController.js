require('dotenv').config()
const stripe = require('stripe')(process.env.STRIPE_KEY)
const Cart = require('../models/cart')

exports.checkout = async (req, res) => {
    const cart = await Cart.findOne({userId: req.user._id}).populate('products.productId')

    if (!cart) return res.status(404).send('No cart')

    const amount = cart.products.reduce((sum, p) => {
        return sum + p.productId.price * p.quantity
    }, 0)

    const charge = await stripe.paymentIntents.create({
        amount: amount,
        currency: 'usd',
        automatic_payment_methods: {
            enabled: true,
        }
    })

    return res.status(200).send(charge)
}
