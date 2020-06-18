const express = require('express')
require('./db/mongoose') 
const userRouter = require('./routers/user')
const tasksRouter = require('./routers/tasks')

const app = express()
const port = process.env.PORT

app.use(express.json())//this pause incoming json 
app.use(userRouter) //registering router with the express application
app.use(tasksRouter) //registering router with the express application

app.listen(port, () => {
    console.log('Server is up on port ' + port);
})