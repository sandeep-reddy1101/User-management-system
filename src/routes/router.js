const express = require('express');
const users = require('../model/user');
const verify = require('../model/verify');
const router = express.Router();


// get method to return user by taking mail and password as inputs in params
router.get('/getUser/:mail/:password', (req, res)=>{
    let custMail = req.params.mail.toLowerCase();
    let custPassword = req.params.password;
    users.getUser(custMail, custPassword).then((userData)=>{
        if(userData){
            res.json(userData)
        }else{
            res.send("mail or password is incorrect")
        }
    }).catch((err)=>{
        console.log(err.message)
        res.send("User does not exist")
    })
})

// router to set up the database
router.get('/setUpDB', (req,res)=>{
    users.setUpDB().then((data)=>{
        res.json(data)
    }).catch((err)=>{
        res.send(err.message)
    })
})

// Post method to insert new user into database
router.post('/insertUser', (req,res)=>{
    try{
        let userObj = req.body;
        userObj.mail = userObj.mail.toLowerCase();
        let custUserID = userObj.userID;
        verify.findUserID(custUserID).then((userInDB)=>{
            if(userInDB){
                res.send("UserID not availabe")
            }else{
                users.insertNewUser(userObj).then((data)=>{
                    res.json(data)
                })
            }
        }).catch((err)=>{
            res.send(err.message)
            console.log(err)
        })
    }catch(error){
        console.log(error);
        res.send("some error occured");
    }
    
})

// get method to return all the users in database
router.get('/getAllUsers', (req,res)=>{
    users.getAllUsers().then((allUsers)=>{
        res.json(allUsers)
    }).catch((err)=>{
        res.send(err.message)
    })
})

// get method which returns list of users based on searched text
router.get('/getSearchedUser/:searchedText', (req,res)=>{
    let searchedUser = req.params.searchedText;
    users.searchUser(searchedUser).then((userData)=>{
        if(userData){
            res.send(userData)
        }
        else{
            let error = new Error("No user found");
            res.send(error)
        }
    }).catch((err)=>{
        console.log(err.message);
    })
})

// get method which returns friendRequest array 
router.get('/getFriendRequests/:mail', (req,res)=>{
    let custMail = req.params.mail;
    users.getFriendRequests(custMail).then((result)=>{
        if(result){
            res.send(result[0].friendRequests);
        }else{
            res.send(null)
        }
    }).catch((err)=>{
        console.log(err)
    })
})

// delete method to delete a friend request
router.put('/deleteFriendRequest', (req,res)=>{
    let obj = req.body;
    let custUserID = obj.userID;
    let friendID = obj.friendID;
    users.deleteFriendRequest(custUserID, friendID).then((result)=>{
        res.send(result)
    }).catch((err)=>{
        console.log(err.message)
    })
})


module.exports = router
