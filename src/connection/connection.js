const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.set("useCreateIndex", true);

// schema
let schema = {
    userName : {
        type : String
    },
    userID : {
        type : String,
        unique : true,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    mail : {
        type : String,
        required : true
    },
    friends : [],
    friendRequests : [],
    chat : [
        {
            fromUserID : {
                type : String,
                required : true,
            },
            toUserID : {
                type : String,
                required : true,
            },
            message : {
                type : String
            },
            time : {
                type : Number
            }
        }
    ]
}


const userSchema = mongoose.Schema(schema, {collection : "userDB", timestamps : {createdAt : true, updatedAt : true}});

collections = {};

const url = "mongodb+srv://sandy:sandy123@chat-app-database.tqpxc.mongodb.net/userDB?retryWrites=true&w=majority";
// Function to setup the connection to database and return model
collections.getCollection = ()=>{
    return mongoose.connect(url, { useNewUrlParser : true, useUnifiedTopology: true}).then((db)=>{
        return db.model('userDB', userSchema)
    }).catch((error)=>{
        console.log(error)
        return error.message
    })
}

module.exports = collections;


