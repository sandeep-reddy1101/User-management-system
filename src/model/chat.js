const { model } = require('mongoose');
const connection = require('../connection/connection');
const verify = require('./verify');

chat = {};

// Function to check and adds the friends
chat.addFriend = (custUserID, friendID)=>{
    try{
        return verify.findUserID(custUserID).then((user)=>{
            if(user){
                return verify.findUserID(friendID).then((friend)=>{
                    if(friend){
                        return verify.findFriend(custUserID, friendID).then((searchResult)=>{
                            if(searchResult == false){
                                return connection.getCollection().then((model)=>{
                                    return model.updateMany({userID : custUserID}, {$push : {friends : friendID}}).then((addedFriend)=>{
                                        if(addedFriend.nModified > 0){
                                            return model.updateMany({userID : friendID}, {$push : {friends : custUserID}}).then((addedUserID)=>{
                                                if(addedUserID.nModified > 0){
                                                    console.log("second")
                                                    return `${custUserID} and ${friendID} are now friends !!!`
                                                }else{
                                                    let error = new Error("Failed to add userID in friends document");
                                                    throw error;
                                                }
                                            })
                                        }else{
                                            let error = new Error("Failed to add friendID");
                                            throw error;
                                        }
                                    })
                                })
                            }else{
                                let error = new Error(`${custUserID} and ${friendID} are already friends`);
                                throw error
                            }
                        })
                    }else{
                        return "friend userID is not found"
                    }
                })
            }else{
                return "userID not found"
            }
        })
    }catch(error){
        return "some error occured"
    }
}

// Function to add message to chatDB
chat.addMessage = (chatObj)=>{
    try{
        let milliSeconds = Date.now();
        chatObj.time = milliSeconds;
        let from = chatObj.fromUserID;
        let to = chatObj.toUserID;
        return verify.findUserID(from).then((fromUser)=>{
            if(fromUser){
                return verify.findUserID(to).then((toUser)=>{
                    if(toUser){
                        return verify.findFriend(from, to).then((friendsFlag)=>{
                            if(friendsFlag){
                                return connection.getCollection().then((model)=>{
                                    return model.updateMany({userID : to}, {$push : {chat : chatObj}}).then((chatAdded)=>{
                                        if(chatAdded){
                                            return "Message added succussfully"
                                        }else{
                                            let error = new Error("Error while adding message to database");
                                            throw error;
                                        }
                                    })
                                }) 
                            }else{
                                let error = new Error("Not friends");
                                throw error;
                            }
                        })
                    }else{
                        let error = new Error("To user not found");
                        throw error;
                    }
                })
            }else{
                let error = new Error("from user not found");
                throw error;
            }
        })
    }catch(error){
        throw error;
    }
}

// Function to return the chat between to users 
chat.getChatBetweenTwoUsers = (mainUserID, friendUserID)=>{
    try{
        return verify.findUserID(mainUserID).then((mainUserIDflag)=>{
            if(mainUserIDflag){
                return verify.findUserID(friendUserID).then((friendUserIDflag)=>{
                    if(friendUserIDflag){
                        let resultObj = {You : [], friend : []}; //You contains others messages and friend contains your messages
                        return connection.getCollection().then((model)=>{
                            return model.find({userID : mainUserID}, {chat : 1, _id : 0}).then((mainUserChat)=>{
                                if(mainUserChat){
                                    return model.find({userID : friendUserID}, {chat : 1, _id : 0}).then((friendUserChat)=>{
                                        if(friendUserChat){
                                            if(mainUserChat[0] && friendUserChat[0]){
                                                let YouChat = mainUserChat[0].chat; 
                                                let otherChat = friendUserChat[0].chat;
                                                let lenYou = YouChat.length;
                                                let lenOther = otherChat.length;
                                                for(let i = 0; i < lenYou ; i++){
                                                    if(YouChat[i].fromUserID == friendUserID){
                                                        resultObj.You.push(YouChat[i]);
                                                    }
                                                }
                                                for(let j = 0; j <  lenOther; j++){
                                                    if(otherChat[j].fromUserID == mainUserID){
                                                        resultObj.friend.push(otherChat[j]);
                                                    }
                                                }
                                                return resultObj
                                            }else if(mainUserChat[0]){
                                                let YouChat = mainUserChat[0].chat;
                                                let len = YouChat.length;
                                                for(let i = 0; i < len; i++){
                                                    if(YouChat[i].fromUserID == friendUserID){
                                                        resultObj.You.push(YouChat[i]);
                                                    }
                                                }
                                                return resultObj
                                            }else if(friendUserChat[0]){
                                                let otherChat = friendUserChat[0].chat;
                                                let len = otherChat.length;
                                                for(let j = 0; j < len ; j++){
                                                    if(otherChat[j].fromUserID == mainUserID){
                                                        resultObj.friend.push(otherChat[j]);
                                                    }
                                                }
                                                return resultObj
                                            }else{
                                                return resultObj
                                            }
                                        }
                                    })
                                }
                            })
                        })
                    }else{
                        let error = new Error("Friend user ID not found");
                        throw error;
                    }
                })
            }else{
                let error = new Error("Main user ID not found");
                throw error;
            }
        })
    }catch(error){
        throw error.message;
    }
}

// Function to return all friends for particular userID
chat.getFriends = (custUserID)=>{
    try{
        return connection.getCollection().then((model)=>{
            return model.find({userID : custUserID}, {friends : 1, _id : 0}).then((friends)=>{
                if(friends.length > 0){
                    return friends[0].friends
                }else{
                    return null
                }
            })
        })
    }catch(error){
        throw error
    }
}

chat.addFriendRequest = (custUserID, friendID)=>{
    return connection.getCollection().then((model)=>{
        return model.find({$and: [{userID: custUserID}, {friendRequests : friendID}]}).then((result)=>{
            if(result.length > 0){
                return false;
            }else{
                return model.updateMany({userID : custUserID}, {$push : {friendRequests : friendID}}).then((response)=>{
                    if(response.nModified > 0){
                        return true
                    }else{
                        return false
                    }
                })
            }
        })
    })
}

module.exports = chat;