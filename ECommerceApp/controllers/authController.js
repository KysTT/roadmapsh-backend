const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs')
const User = require('../models/user')

exports.signup = async (req, res) => {
    const { name, email, password } = req.body

    const salt = await bcrypt.genSalt(10)
    const hashedPass = await bcrypt.hash(password, salt)

    const user = new User({name, email, password: hashedPass})
    try{
        await user.save()
        res.status(200).send('success')
    } catch (err) {
        res.status(400).send(err)
    }
}

exports.login = async (req, res) => {
    const { email, password } = req.body

    const user = await User.findOne({email})
    if (!user) {
        return res.status(404).send('User not found')
    }

    const userPass = await bcrypt.compare(password, user.password)
    if (!userPass) {
        return res.status(400).send('Invalid password')
    }

    const token = jwt.sign({_id: user._id, role: user.role}, process.env.JWT_KEY)
    res.header('authorization', token).status(200).send({token})
}