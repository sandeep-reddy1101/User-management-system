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
        res.send(err.message)
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

module.exports = router
