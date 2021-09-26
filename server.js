const express = require('express')
const connectDB = require('./dB/connection.js')
const app = express();

connectDB();

app.use(express.json({ extended: false }));

app.use('/uploads', express.static(__dirname + '/public'));

app.use('/api/users',require('./Controllers/usersController'))
app.use('/api/chat',require('./Controllers/chatController'))


//const Port = process.env.Port || 3000
app.listen(process.env.PORT || 3000)
//app.listen(Port,() => console.log('server started'))