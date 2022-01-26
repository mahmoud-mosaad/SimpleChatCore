
const redisClient = require('../config/redisDb')

module.exports = function (server) {

    const io = require('socket.io')(server)
    var peers = {}
    var userThreads = {}

    io.on('connection', socket => {

        socket.on('join', async ({user, threads}) => {
            threads.forEach(thread => {
                var threadID = "thread:" + thread
                socket.join(threadID)
                socket.to(threadID).emit('join', user)
                
                if (userThreads[user.id] == undefined){
                    userThreads[user.id] = []
                    if (userThreads[user.id][thread] == undefined){
                        userThreads[user.id].push(thread)
                    }   
                }
            })
            await redisClient.saddAsync("ChatOnlineUsers", socket.id)
            await redisClient.setAsync(`socket:${socket.id}`, user.id)
            await redisClient.setAsync(`user:${user.id}`, socket.id)
        })

        socket.on('disconnect', async () => {
            const userId = await redisClient.getAsync(`socket:${socket.id}`)
            io.emit('leave', userId)
            await redisClient.delAsync(`socket:${socket.id}`)
            await redisClient.sremAsync("ChatOnlineUsers", socket.id)

            if (userThreads[userId] != undefined){
                userThreads[userId].forEach(thread => {
                    if (peers[thread] > 0){
                        peers[thread]--
                        // this.broadcast("RemoveVideo")
                    }    
                });
            }
        })

        socket.on('subscribe', async (data) => {
            var threadID = "thread:" + data.thread
            const socketId = await redisClient.getAsync(`user:${data.contact}`)
            socket.emit('registered', data)
            socket.to(socketId).emit('registered', data)
        })

        socket.on('subscribeGroup', async (data) => {
            const socketId = await redisClient.getAsync(`user:${data.contact}`)
            io.to(socketId).emit('registeredGroup', data)
        })

        socket.on('chat', (data) => {
            var threadID = "thread:" + data.thread
            socket.to(threadID).emit('chat', data.message)
        })

        socket.on('audio', data => {
            var threadID = "thread:" + data.thread
            socket.to(threadID).emit('audio', data.message)
        })

        socket.on('contact', data => {
            var threadID = "thread:" + data.thread
            socket.join(threadID)
            io.to(threadID).emit('contact', data.message)
        })

        socket.on('group', data => {
            var threadID = "thread:" + data.thread
            socket.join(threadID)
            io.to(threadID).emit('group', data.message)
        })

        socket.on('startTyping', data => {
            var threadID = "thread:" + data.thread.id
            socket.broadcast.to(threadID).emit('startTyping', data)
        })

        socket.on('stopTyping', data => {
            var threadID = "thread:" + data.thread.id
            socket.broadcast.to(threadID).emit('stopTyping', data)
        })

        /*

            Streaming audio and video

        */

        socket.on('requestCall', (callInfo) => {
            var threadID = "thread:" + callInfo.threadId
            socket.to(threadID).emit('requestCall', callInfo)
        })

        socket.on('refuseCall', (callInfo) => {
            var threadID = "thread:" + callInfo.threadId
            socket.to(threadID).emit('refuseCall', callInfo)
        })

        socket.on('endCall', (callInfo) => {
            var threadID = "thread:" + callInfo.threadId
            if (!callInfo.established){
                io.to(threadID).emit('endCall', callInfo)
            }
            else{
                io.to(threadID).emit("cancelCall", callInfo)
            }
        })

        socket.on('acceptCall', (callInfo) => {
            var threadID = "thread:" + callInfo.threadId
            io.to(threadID).emit('acceptCall', callInfo)
        })

        socket.on("newPeer", (callInfo) => {
            var threadID = "thread:" + callInfo.threadId

            if (peers[callInfo.threadId] == undefined){
                peers[callInfo.threadId] = 0
            }

            var clients = peers[callInfo.threadId]

            if (clients < 2){
                if (clients == 1){
                    socket.emit('createPeer')
                }
            }
            else
                socket.emit('sessionActive')
            // io.to(threadID).emit('increaseCallPeers', callInfo)
            peers[callInfo.threadId]++
        })

        socket.on('Offer', (offer) => {
            console.log('Offer')
            var threadID = "thread:" + offer.callInfo.threadId
            socket.broadcast.to(threadID).emit("BackOffer", {data: offer.data, callInfo: offer.callInfo})  
        })

        socket.on('Answer', (answer) => {
            console.log('Answer')
            var threadID = "thread:" + answer.callInfo.threadId
            socket.broadcast.to(threadID).emit("BackAnswer", {data: answer.data, callInfo: answer.callInfo})  
        })

        socket.on('ShareScreen', () => {
            this.emit('ShareScreen')
        })

        socket.on('OfferScreen', (offer) => {
            this.broadcast.emit("BackOfferScreen", offer)  
        })

        socket.on('AnswerScreen', (data) => {
            this.broadcast.emit("BackAnswerScreen", data) 
        })

        socket.on('StopShareScreen', () => {
            this.broadcast.emit('StopShareScreen')
        })


    })


    // function Disconnect(){
    //     if (clients > 0){
    //         clients--;
    //         // this.broadcast("RemoveVideo")
    //     }
    // }

    // function CancelCall(){
    //     io.emit("CancelCall")
    // }

    // function SendOffer(offer){
    //     this.broadcast.emit("BackOffer", offer)    
    // }

    // function SendAnswer(data){
    //     this.broadcast.emit("BackAnswer", data)    
    // }

    // function ShareScreen(){
    //     this.emit('ShareScreen')
    // }

    // function StopShareScreen(){
    //     this.broadcast.emit('StopShareScreen')
    // }

    // function SendOfferScreen(offer){
    //     this.broadcast.emit("BackOfferScreen", offer)    
    // }

    // function SendAnswerScreen(data){
    //     this.broadcast.emit("BackAnswerScreen", data)    
    // }
    
}
