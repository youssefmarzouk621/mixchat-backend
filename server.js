const express = require('express')
const connectDB = require('./dB/connection.js')
const app = express();

connectDB();

var http = require("http").createServer(app);
var socketIO = require("socket.io")(http, {
    cors: {
        origin: "*"
    }
});

var users = [];


socketIO.on("connection", function (socket) {
    
    socket.on("connected", function (userId) {
        users[userId] = socket.id;
        console.log(users);
    });

    socket.on("sendEvent", function (data) {
        const message = {
            "from": data.sender,
            "message": data.message
        };
        socketIO.to(users[data.receiver]).emit("messageReceived", message);
    });
 
    // socket.on("sendEvent") goes here
});



app.use(express.json({ extended: false }));

app.use('/uploads', express.static(__dirname + '/public'));

app.use('/api/users',require('./Controllers/usersController'))
app.use('/api/chat',require('./Controllers/chatController'))



app.listen(process.env.PORT || 3000,()=>{
    console.log("server started on port 3000")
})
