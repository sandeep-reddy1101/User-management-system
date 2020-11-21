const express = require('express');
const chat = require('../model/chat');
const services = require('../service/services');
const chatRouter = express.Router();

// put method to add friends
chatRouter.put('/addfriend/', (req,res)=>{
    let obj = req.body;
    let custUserID = obj.userID;
    let friendID = obj.friendID;
    console.log("first", obj)
    chat.addFriend(custUserID, friendID).then((result)=>{
        if(result){
            console.log("three")
            res.json(result)
        }
    }).catch((err)=>{
        console.log("second", err.message)
        res.send(err.message)
    })
});

// Post method to add message in the user document
chatRouter.post('/message', (req,res)=>{
    let chatObj = req.body;
    chat.addMessage(chatObj).then((result)=>{
        if(result){
            res.json(result)
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
            res.json(resultchat);
        }
    }).catch((err)=>{
        console.log("error")
        res.send(err.message);
    })
})

// Get method to return all friends ID in list 
chatRouter.get('/getFriends/:userID', (req,res)=>{
    let custUserID = req.params.userID;
    chat.getFriends(custUserID).then((result)=>{
        if(result){
            res.send(result)
        }else{
            res.send(null)
        }
    }).catch((err)=>{
        res.send(err.message)
    })
})

// put method to add friendrequest in database returns true or false
chatRouter.put('/addFriendRequest', (req, res)=>{
    let custUserID = req.body.userID;
    let friendID = req.body.friendID;
    chat.addFriendRequest(custUserID, friendID).then((result)=>{
        res.send(result)
    }).catch((err)=>{
        console.log(err.message);
    })
})

module.exports = chatRouter;