const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
var cors = require('cors')

const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:8080",
    methods: ["GET", "POST"]
  }
});
const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.use(cors())

io.on('connection', (socket) => {
  socket.on('chatId',(data)=>{
    console.log(data[0]);
    socket.on(data[0],(msg)=>{
      console.log(msg);
      io.emit(data[0], data[1]+': '+msg);
    })
  });
});

server.listen(5000, () => {
  console.log('listening on *:5000');
});