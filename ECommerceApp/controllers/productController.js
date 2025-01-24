const Product = require('../models/product')

exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find()
        return res.status(200).send(products)
    } catch (err) {
        return res.status(400).send(err)
    }
}

exports.createProduct = async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).send('Access denied')
    const product = new Product(req.body)

    try {
        await product.save()
        res.status(200).send('Product created')
    } catch (err) {
        res.status(400).send(err)
    }
}

exports.editProduct = async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).send('Access denied')
    const _id = req.params.id

    try {
        await Product.replaceOne({_id}, req.body)
        res.status(200).send('Product updated')
    } catch (err) {
        res.status(400).send(err)
    }
}

exports.deleteProduct = async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).send('Access denied')
    const _id = req.params.id

    try {
        await Product.deleteOne({_id})
        res.status(200).send('Product deleted')
    } catch (err) {
        res.status(400).send(err)
    }
}