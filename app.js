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

 var clients = 0; //This will keep track of number of clients.
/**
 * Writing code to react when some client connects
 */

io.on('connection', (socket) => {
    console.log(`client ${++clients} connected to the server.`);

    /**
     *? Let's send message to the client after 5 seconds of connection
     */
    // setTimeout(() => {
        // socket.send(`Sent a message from server after 5 seconds of user connected`);
    //     socket.emit('newEvent', {message: "Sent a message from server after 5 seconds of user connected"});
    // }, 5000);

    // socket.on('clientEvent', (message) => {
    //     console.log(message);
    // });

    /**
     *? Every time client joins, let's broadcast the total
     *? number of clients to all the clients.
     */
    io.sockets.emit('broadcast', {
        description: `${clients} client/s connected.`
    }, console.log(`${clients} client/s connected.`));

    socket.on('disconnect', () => {
        console.log(`client ${clients} disconnected.`)
        io.sockets.emit('broadcast', {
            description: `client ${clients--} disconnected.`
        });
        io.sockets.emit('broadcast', {
            description: `${clients} client/s connected.`
        });
    });
});

/**
 *! Starting the http server
 */

http.listen(serverConfig.PORT, hostname, () => {
    console.log(`Server running at http://${hostname}:${serverConfig.PORT}/`);
});

