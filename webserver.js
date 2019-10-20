const fs = require('fs')

const express = require('express')

const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)

const PORT = process.env.PORT || 3000;


// const rConn = new Rcon('192.168.1.5', '25575', 'password', options); //get it? rcon -> rconn :)))))



app.use(express.static('public'))

app.get('/*', function(req, res) {// jank for the jank gods
    console.log(req.url);
    if(req.url == "/") req.url = "index"
    let path = __dirname + '/routes/' + req.url + '.html'
    fs.stat(path, (err) => {
        if(err) {
            return res.sendFile(__dirname + '/routes/404.html')
        }
        res.sendFile(path)
    })
    
})

io.on('connection', function(socket){
  console.log('a user connected')
  fs.readFile(__dirname + "/latest.log", (err, data) => {
    if(err) throw err
    socket.emit("new log", data.toString().split('\n'))
  })
  
  socket.emit("server info", {startTime: Date.now()});

  socket.on("send cmd", cmd => {
    //todo: cmd stuff
    console.log('cmd received: ' + cmd)
    socket.emit("cmd received")
  })
})

http.listen(PORT, function(){
  console.log(`listening on *:${PORT}`)
})
