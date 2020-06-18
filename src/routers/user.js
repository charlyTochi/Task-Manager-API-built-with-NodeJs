const express = require('express')
const multer = require('multer')
const router = new express.Router()
const sharp = require('sharp')
const User = require('../models/user')
const auth = require('../middleware/auth')
const { sendWelcomeEmail }  =  require('../emails/account')

router.post('/users', async (req, res) => { //here we created our rest api route used for creating a new user
    const user  =  new User(req.body)
    try {
        await user.save()
        sendWelcomeEmail(user.email, user.name)//send email
        const token = await user.generateAuthToken()//generating a new token on signup
        res.status(200).send({user, token})//seinding user and token as properties
    } catch (e) {
        res.status(500).send(e)
    }
})


router.post('/users/login', async (req, res) =>{ //{this is http request for loginning in
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()//generating a new token
        res.send({ user, token})//seinding user and token as properties
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/users/me', auth ,async (req, res) => { //here we created our rest api route used for getting all created users auth inclusive
   res.send(req.user)
}) 

router.get('/users', auth ,async (req, res) => { //here we created our rest api route used for getting all created users
    try {
    const users = await User.find({})
    res.send(users)
} catch (e) {
    res.status(500).send(e)
}
 })


router.patch('/users/me', auth, async (req, res) => { //this code updates user details
    const updates = Object.keys(req.body)
    const allowedUpdates  = ["name", "email", "password", "age" ]
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    
    if(!isValidOperation){
        return res.status(400).send({error: 'Invalid updates'})
    }
    try {
        updates.forEach((update) => req.user[update]  =  req.body[update])
        await req.user.save()
        res.send(req.user)
    } catch (e) {
        res.status(500).send(e)
    }
}) 


// file uploads 
const upload = multer({//this is were we define folder that our image will go to (destination directory)
    limits:{
     fileSize: 1000000 // here, we are limiting the number size of image to 1mb
    },
 // here we are stating the type of pdf that our upload should allow 
 fileFilter(req, file, cb){
    if(!file.originalname.match(/\.(jpg|png|jpeg)$/) ){
         return cb(new Error('Please upload an image'))
     }
     cb(undefined, true)
    }
})

// route for adding avatar 
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    // converting image to png before uploading
    const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250 }).png().toBuffer()
    req.user.avatar =  buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {//callback error message
    res.status(400).send({ error: error.message})
})


// route for deleting avatar 
router.delete('/users/me/avatar', auth, async (req, res) => {
 req.user.avatar = undefined
 await req.user.save()
 res.send()
})


// fetch profile picture using url structure
// http://localhost:3000/users/5eea28eeb6a5065678aeebee/avatar
router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user || !user.avatar)  {
            throw new Error()
        }
        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    } catch (e) {
        res.status(404).send()
    }
})

module.exports = router 