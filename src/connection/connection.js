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

// Function to setup the connection to database and return model
collections.getCollection = ()=>{
    return mongoose.connect('mongodb://localhost:27017/userDB', { useNewUrlParser : true}).then((db)=>{
        return db.model('userDB', userSchema)
    }).catch((error)=>{
        return error.message
    })
}

module.exports = collections;


