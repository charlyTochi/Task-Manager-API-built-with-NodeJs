const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')//the auth middleware looks for the header that the user is supposed to provide
        const decoded = jwt.verify(token, process.env.JWT_SECRET)//validating the header
        const user = await User.findOne({ _id: decoded._id , 'tokens.token': token})
        if (!user) {
            throw new Error()
        }

        req.token = token
        req.user =  user
        next()
    } catch (e) {
        res.status(500).send({error: 'Please authenticate'})
    }
   
}

module.exports = auth