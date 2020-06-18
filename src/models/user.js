const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Tasks = require('./task')

const userSchema = new mongoose.Schema(
// defining the model
//creating a new instance of the model
{
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error ('Email is invalid')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value){
            if(value < 0){
                throw new Error ('Age must be a positive number')
            }
        }
    },
    tokens: [{
       token: {
           type: String,
           required: true 
       }
    }],
    avatar:{
        type: Buffer
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        trim: true,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error ('Password cannot contain "password" ')
            }
        }
    },
 },{
     timestamps: true
 }
 )


    // setting up relationship between user and task model
    userSchema.virtual('tasks', {
        ref: 'Tasks',
        localField: '_id',
        foreignField: 'owner'
    })



    // restricting access to json results on login 
    userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()
    delete userObject.password //here we are deleting the password so that the user will not be ablie to access it
    delete userObject.tokens//deleting the tokens so user will not be able to access it
    delete userObject.avatar//deleting the tokens so user will not be able to access it
    return userObject
}



// generating token on login 
 userSchema.methods.generateAuthToken = async function () {
     const user = this
    //  creating token 
     const token = jwt.sign({ _id: user._id.toString()} , process.env.JWT_SECRET)
//    saving the token to the database
     user.tokens = user.tokens.concat({ token})
     await user.save()
     return token
    }


    // delete user tasks when user is removed 
    userSchema.pre('remove', async function (next) {
        const user = this
        await Tasks.deleteMany({ owner: user._id})
        next()

    })




//  this validates login process 
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email})
    if (!user) {
        throw new Error('unable to login')
    }
    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('Unable to Login')
    }
    return user
}



//hash the plain text password be4 saving
 userSchema.pre('save', async function (next){
    const user = this
    console.log('hash password just before saving');

    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
 })

//  this line of code can be used as a ref in annother model to do fetch info wrt relationship
 const User = mongoose.model('User', userSchema )
 module.exports = User