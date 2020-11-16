const connection = require('../connection/connection');

verify = {};

// Funtion to find the given user in database
verify.findUserID = (custUserID)=>{
    return connection.getCollection().then((model)=>{
        return model.find({userID : custUserID}).then((user)=>{
            if(user.length > 0){
                return user
            }else{
                return null
            }
        })
    })
};

// Function to find whether friend ID is present in friends array 
verify.findFriend = (custUserID, friendID)=>{
    return connection.getCollection().then((model)=>{
        return model.find({userID : custUserID}).then((userDetails)=>{
            let friends = userDetails[0].friends;
            let flag = friends.indexOf(friendID);
            if(flag != -1){
                return true
            }else{
                return false
            }
        })
    })
};

module.exports = verify;