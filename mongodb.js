// not important 
//CRUD 
const { MongoClient, ObjectID} = require ('mongodb')

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

const id  = new ObjectID()
console.log(id);
console.log(id.getTimestamp());


// here we try connecting our mongodb using the below query 
MongoClient.connect(connectionURL, { useNewUrlParser: true }, (error, client) =>{
    if(error){
    return console.log('Unable to connect to database');
    }
    const db = client.db(databaseName)
})



     // deleting many 
    //  db.collection('users').deleteMany({
    //     age: 24
    // }).then((result) => {
    //    console.log(result);
       
    // }).catch((error) => {
    //     console.log(error);
        
    // })

 //update one field in the database
//  db.collection('users').updateOne({
//     _id: new ObjectID("5edc9fa0eb719b1b1c8c8b40")
// }, {
//     $set: {
//         name: 'Mike'
//     }
// }).then((result) => {
//     console.log(result);
// }).catch((error) => {
//     console.log(error);
// })

// reading from mongo db 
// db.collection('users').findOne({_id:new ObjectID("5edcaaa7048fe44b3cd51040") } , (error, user) =>{
    //     if(error){
    //         return console.log("Unable to fetch");
    //     }
    //     console.log(user);
    // })

    // find doesent take in a callback  it fetches multiple pieces of data using an identity
    // db.collection('users').find({ age: 24}).toArray((error, users) => {
    //     console.log(users);
        
    // })
  // db.collection('users').insertOne({
    //     name: 'kilo',
    //     age: 24
    // }, (error, result) => {
    //      if(error){
    //          return console.log("Unable to insert user");
    //      }
    //      console.log(result.ops);//ops is an array of document   
    // })
// db.collection('tasks').insertMany([
    //     {
    //         name: 'John doe',
    //         completed: true
    //     }, {
    //         name: 'Micheal J',
    //         completed: true
    //     }, {
    //         name: 'Kelvin H',
    //         completed: true
    //     }
    //      ], (error, result) => {
    //         if(error){
    //             return console.log("Unable to insert documents");
    //         }
    //         console.log(result.ops);
    //     })

