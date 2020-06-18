const mongoose = require('mongoose')
const validator = require('validator')


// defining the model
//creating a new instance of the model
const taskSchema = new mongoose.Schema(
{
    description: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        default:false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'//this  property value is gotten from the user model used for relationship
    }
 },{
    timestamps: true
 })

 const Tasks = mongoose.model('Tasks', taskSchema)


 
 module.exports = Tasks
