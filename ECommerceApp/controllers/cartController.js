const Cart = require('../models/cart')

exports.getCart = async (req, res) => {
    try{
        const cart = await Cart.findOne({userId: req.user._id}).populate('products.productId')
        res.status(200).send(cart)
    } catch (err) {
        res.status(400).send(err)
    }
}

exports.addProducts = async (req, res) => {
    const {productId, quantity} = req.body

    try{
        let cart = await Cart.findOne({userId: req.user._id})
        if (!cart) {
            cart = new Cart({userId: req.user._id})
        }
        const existingProduct = cart.products.find((product) => product.productId === productId)
        if (existingProduct) {
            existingProduct.quantity += quantity
        } else{
            cart.products.push({productId, quantity})
        }
        await cart.save()
        res.status(200).send('Products added successfully')
    }catch(err){
        res.status(400).send(err)
    }
}