const bcrypt = require('bcryptjs');
const { response } = require('express');
const connection = require('../connection/connection');

users = {};

let user1 = {
    userID : 'sandeep123',
    userName : 'sandeep',
    password : 'Sandeep@123',
    mail : 'sandeepnimmala01@gmail.com'
}

// Function to hash the password sync ly takes password and gives hash password
hashPassword = (custPass)=>{
    let hash = bcrypt.hashSync(custPass, 8);
    return hash
}

// Function to compare hash password with user custome password
comparePassword = (custPass, pass)=>{
    let flag = bcrypt.compareSync(custPass, pass); 
    return flag
}

// inital database set up
users.setUpDB = ()=>{
    return connection.getCollection().then((model)=>{
        return model.deleteMany().then((empty)=>{
            let hash = hashPassword(user1.password); //calling hash func
            user1.password = hash; // replacing hash password in place of normal password
            return model.insertMany(user1).then((inserted)=>{
                if(inserted){
                    return inserted
                }
            })
        })
    })
}

// get the user matching mail and password
users.getUser = (custMail, custPassword)=>{
    return connection.getCollection().then((model)=>{
        // finding the user with mail
        return model.find({mail : custMail}).then((userData)=>{
            // userData is in array form
            if(userData.length > 0){
                let hashpass = userData[0].password; 
                let flag = comparePassword(custPassword, hashpass); // calling hash password compare func
                if(flag){
                    return userData[0]
                }else{
                    return null
                }
            }else{
                return null
            }
        }).catch((error)=>{
            return "User does not exist"
        })
    })
}

// insert the new user into database
users.insertNewUser = (userObj)=>{
    console.log(userObj,userObj.password)
    let hashpass = hashPassword(userObj.password);
    userObj.password = hashpass;
    return connection.getCollection().then((model)=>{
        return model.insertMany(userObj).then((inserted)=>{
            if(inserted){
                return inserted
            }else{
                return null
            }
        }).catch((error)=>{
            return error.message
        })
    })
}

// returns all the users present in database
users.getAllUsers = ()=>{
    return connection.getCollection().then((model)=>{
        return model.find().then((allUsers)=>{
            if(allUsers.length > 0){
                return allUsers
            }else{
                return nill
            }
        })
    })
}

users.searchUser = (searchedText)=>{
    let a = searchedText.slice(0,3);
    let regexPattern = `^${a}`;
    return connection.getCollection().then((model)=>{
        return model.find({$or : [{userID : searchedText}, {mail : searchedText}]}, {_id : 0}).then((userDetails)=>{
            if(userDetails.length > 0){
                return userDetails;
            }else{
                return model.find({userID : {$regex : regexPattern}}, {_id : 0}).then((relatedUsers)=>{
                    if(relatedUsers.length > 0){
                        return relatedUsers;
                    }else{
                        return null;
                    }
                })
            }
        })
    })
}

users.getFriendRequests = (custMail)=>{
    return connection.getCollection().then((model)=>{
        return model.find({mail : custMail}, {_id : 0, friendRequests : 1}).then((response)=>{
            if(response.length > 0){
                return response
            }else{
                return null
            }
        })
    })
}

users.deleteFriendRequest = (custUserID, friendID)=>{
    return connection.getCollection().then((model)=>{
        return model.updateMany({userID:custUserID}, {$pull:{friendRequests : friendID}}).then((response)=>{
            console.log(response)
            if(response.nModified > 0){
                console.log("second")
                return true
            }else{
                return false
            }
        })
    })
}

module.exports = users;