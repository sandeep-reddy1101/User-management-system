const express = require('express');
const chat = require('../model/chat');
const services = require('../service/services');
const chatRouter = express.Router();

// put method to add friends
chatRouter.put('/addfriend/:userID/:friendID', (req,res)=>{
    let custUserID = req.params.userID;
    let friendID = req.params.friendID;
    chat.addFriend(custUserID, friendID).then((result)=>{
        if(result){
            res.send(result)
        }
    }).catch((err)=>{
        res.send(err.message)
    })
});

// Post method to add message in the user document
chatRouter.post('/message', (req,res)=>{
    let chatObj = req.body;
    chat.addMessage(chatObj).then((result)=>{
        if(result){
            res.send(result)
        }else{
            res.send("Not able to send message")
        }
    }).catch((err)=>{
        res.send(err.message)
    })
})

// get method to return the messages between two users
chatRouter.get('/getChat/:mainUserID/:friendUserID', (req,res)=>{
    let mainUserID = req.params.mainUserID;
    let friendUserID = req.params.friendUserID;
    services.arrangeChat(mainUserID, friendUserID).then((resultchat)=>{
        if(resultchat){
            res.send(resultchat);
        }
    }).catch((err)=>{
        res.send(err.message);
    })
})

module.exports = chatRouter;