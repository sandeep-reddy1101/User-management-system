const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.set("useCreateIndex", true);

let chatschema = {
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
        type : Date,
        default : new Date()
    }
};

const chatSchema = mongoose.Schema(chatschema, {collection : 'chatDB', timestamps : {createdAt : true, updatedAt : true}});

chatCollection = {};

chatCollection.getChatCollection = ()=>{
    console.log('connecting')
    return mongoose.createConnection('mongodb://localhost:27017/chatDB', { useNewUrlParser : true}).then((db)=>{
        console.log('db')
        return db.model('chatDB', chatSchema)
    }).catch((error)=>{
        console.log(error)
        return error.message
    })
};


module.exports = chatCollection;