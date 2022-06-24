const express = require("express");
const serverConfig = require("./configs/server.config");
const app = express();

const http = require("http").Server(app); //Binding express to http

//Binding http server to the socket.io
const io = require('socket.io')(http);

const hostname = '127.0.0.1';

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/views/index.html");
});

/**
 * !Types of standard events:
 * 
 * !1. Server Side
  
 *? a. Connect
 *? b. Message
 *? c. Disconnect
 *? d. Reconnect
 *? e. Ping
 *? f. Join
 *? g. Leave

 * !2. Client Side:
 
 * ? a. connect
 * ? b. connect_error
 * ? c. connect_timeout
 * ? d. reconnect
 */

/**
 * Writing code to react when some client connects
 */

io.on('connection', (socket) => {
    console.log(`A User connected to the server.`);

    /**
     * Let's send message to the client after 5 seconds of connection
     */
    setTimeout(() => {
        socket.send(`Sent a message from server after 5 seconds of user connected`);
    }, 5000);
    socket.on('disconnect', () => {
        console.log(`User is disconnected.`);
    });
});

/**
 * Starting the http server
 */

http.listen(serverConfig.PORT, hostname, () => {
    console.log(`Server running at http://${hostname}:${serverConfig.PORT}/`);
});

