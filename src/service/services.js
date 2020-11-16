const myChat = require('../model/chat');

services = {};


// Function to arrange chat in readable format
services.arrangeChat = (mainUserID, friendUserID)=>{
    return myChat.getChatBetweenTwoUsers(mainUserID, friendUserID).then((usersChat)=>{
        let friendsMessages = usersChat.You;
        let yourMessages = usersChat.friend;
        let finalArray = [];
        let ids = [];
        let flen = friendsMessages.length;
        let ylen = yourMessages.length;
        console.log(friendsMessages, yourMessages)
        if(flen > 0 && ylen > 0){
            for(let i=0 ; i < flen ; i++){
                let time1 = friendsMessages[i].time;
                for(let j=0 ; j < ylen ; j++){
                    let time2 = yourMessages[j].time;
                    console.log(friendsMessages[i].message,time1, yourMessages[j].message,time2);
                    if(time1 <= time2){
                        let index = ids.indexOf(friendsMessages[i]._id);
                        if(index == -1){
                            let sampleStr = friendUserID + " : " + friendsMessages[i].message;
                            finalArray.push(sampleStr);
                            ids.push(friendsMessages[i]._id);
                        }
                        console.log(finalArray)
                        break;
                    }else{
                        let index = ids.indexOf(yourMessages[j]._id);
                        if(index == -1){
                            let sampleArray = "You : " + yourMessages[j].message;
                            finalArray.push(sampleArray);
                            ids.push(yourMessages[j]._id);
                        }
                        console.log(finalArray)
                    }
                }
            }
            for(let a=0;a<flen;a++){
                let id = friendsMessages[a]._id;
                if(ids.indexOf(id) == -1){
                    let sample = friendUserID + " : " + friendsMessages[a].message;
                    finalArray.push(sample);
                    ids.push(id);
                }
            }
            for(let b=0;b<ylen;b++){
                let id = yourMessages[b]._id;
                if(ids.indexOf(id) == -1){
                    let sample = "You : " + yourMessages[b].message;
                    finalArray.push(sample);
                    ids.push(id);
                }
            }
        }else if(ylen == 0 && flen > 0){
            for(let i = 0; i < flen ; i++){
                let sample = "You : " + yourMessages[i].message;
                finalArray.push(sample);
            }
        }else if(flen == 0 && ylen > 0){
            for(let i = 0; i < ylen ; i++){
                let sample = friendUserID + " : " + friendsMessages[i].message;
                finalArray.push(sample);
            }
        }
        return finalArray;
    })
};

module.exports = services;