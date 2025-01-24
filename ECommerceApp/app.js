const express = require('express')
const authRoute = require('./routes/authRoute')
const productRoute = require('./routes/productRoute')
const cartRoute = require('./routes/cartRoute')
const paymentRoute = require('./routes/paymentRoute')
const connectDB = require('./connectDB')
require('dotenv').config()

connectDB()

const app = express()
app.use(express.json())

app.use('/auth', authRoute)
app.use('/store', productRoute)
app.use('/cart', cartRoute)
app.use('/', paymentRoute)

const port = process.env.PORT || 3000
app.listen(port, () => {})