const express = require('express')
const router = new express.Router()
const Tasks = require('../models/task')
const auth = require('../middleware/auth')


router.post('/tasks', auth, async (req, res) => { //here we created our rest api route used for creating a new task
    const task = new Tasks({
        ...req.body,
        owner: req.user._id
    })

    try {
        await task.save()
        res.status(200).send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})

//get tasks?completed=true
//get //tasks?limit
//get //tasks?limit&skip=2
// get/tasks?sortbBy=createdAt_asc or desc

// limit skip for pagination
router.get('/alltasks', auth, async (req, res) => { //here we created our rest api route used for getting all  task created by a particular person
   const match = {} 
   const sort = {}

   if (req.query.completed) {
       match.completed = req.query.completed === 'true'
   }

//    dynamically sorting tasks 
   if (req.query.sortBy) {
       const parts = req.query.sortBy.split(':')
       sort[parts[0]] = parts[1] === 'desc' ? -1: 1 
   }
    try {
       await req.user.populate({
         path: 'tasks' ,
         match,
         options: {
             limit: parseInt(req.query.limit),
             skip: parseInt(req.query.skip), 
             sort
         }
       }).execPopulate()
       res.send(req.user.tasks)
   } catch (e) {
       res.status(500).send()
   }

})



router.get('/tasks/:id', auth, async (req, res) => { //here we created our rest api route used for get a particular task by id
   const _id = req.params.id
   try {
        const task  = await Tasks.findOne({ _id, owner: req.user._id})
       if(!task) {
           return res.status(404).send()
       }
       res.send(task)
   } catch (e) {
       res.status(500).send()
   }
})



router.patch('/tasks/:id', auth, async (req, res) => { //this code updates tasks wrt to the the creator or owner of that task
    const updates = Object.keys(req.body)
    const allowedUpdates  = ["description", "completed" ]
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    
    if(!isValidOperation){
        return res.status(400).send({error: 'Invalid updates'})
    }
    try {
        const tasks = await Tasks.findOne({ _id: req.params.id, owner: req.user._id})
    
        if(!tasks){
            return res.status(404).send()
        }
        updates.forEach((update) => tasks[update]  =  req.body[update])
        await tasks.save()
        res.send(tasks)
    } catch (e) {
        res.status(400).send(e)
    }
}) 


// used to delete

router.delete('/tasks/:id', auth, async (req, res) => {
    try{
        const task = await Tasks.findOneAndDelete({ _id: req.params.id, owner: req.user._id})

        if(!task){
            res.status(404).send()
        }

        res.send(task)
    } catch (e){
        res.status(500).send()
    }
})

module.exports = router 