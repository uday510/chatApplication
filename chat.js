const express = require("express");
const serverConfig = require("./configs/server.config");
const app = express();

const http = require("http").Server(app); //Binding express to http

//Binding http server to the socket.io
const io = require('socket.io')(http);

const hostname = '127.0.0.1';

app.get("/chatServer", (req, res) => {
    res.sendFile(__dirname + "/views/chat.html");
});

/**
 * user repository
 */

/**
 * user repository
 */
const users = [] ;

io.on('connection', (socket)=>{
    console.log("User is connected");

    /**
     * Listen to the event setUserName
     */
    socket.on("setUserName", (name)=>{
        console.log(name);
        /**
         * Check if the user name is already taken
         */
        if(users.indexOf(name) > -1){
            /**
             * Respond back to the client that username is already taken
             */
            socket.emit('userExists', name + " : userName is already taken.Try something different");
        }else{
            users.push(name);
            socket.emit('userSet', {username : name});
        }

        /**
         * Listen on the message event
         */
        socket.on('msg', (data)=>{
           /**
            * Since this is a group chat, this message
            * should be broadcasted to all the users
            */
           io.sockets.emit('newmsg',data);
        });

    })
})

/**
 *! Starting the http server
 */

http.listen(PORT = Number(serverConfig.PORT) + 1, hostname, () => {
    console.log(`Server running at http://${hostname}:${PORT}/`);
});

