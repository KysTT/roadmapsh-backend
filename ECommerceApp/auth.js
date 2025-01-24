const jwt = require('jsonwebtoken')

const authenticate = (req, res, next) => {
    const token = req.headers.authorization
    if (!token) return res.status(401).send('No token provided')

    try{
        req.user = jwt.verify(token, process.env.JWT_KEY)
        next()
    } catch(err){
        res.status(401).send('Bad token')
    }
}

module.exports = authenticate