
const redisClient = require('../config/redisDb')

module.exports = function (server) {

    const io = require('socket.io')(server)

    io.on('connection', socket => {

        socket.on('join', async ({user, threads}) => {
            threads.forEach(thread => {
                var threadID = "thread:" + thread
                socket.join(threadID)
                socket.to(threadID).emit('join', user)
            });
            await redisClient.saddAsync("ChatOnlineUsers", socket.id)
            await redisClient.setAsync(`socket:${socket.id}`, user.id)
            await redisClient.setAsync(`user:${user.id}`, socket.id)
        })

        socket.on('disconnect', async () => {
            const userId = await redisClient.getAsync(`socket:${socket.id}`)
            io.emit('leave', userId)
            await redisClient.delAsync(`socket:${socket.id}`)
            await redisClient.sremAsync("ChatOnlineUsers", socket.id)
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
            console.log(data.thread)
            var threadID = "thread:" + data.thread
            socket.broadcast.to(threadID).emit('startTyping', data)
        })

        socket.on('stopTyping', data => {
            var threadID = "thread:" + data.thread
            socket.broadcast.to(threadID).emit('stopTyping', data)
        })

    })

}
