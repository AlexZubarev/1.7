const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/public'));
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/*', (req, res) => {
    res.sendFile(__dirname + req.originalUrl);
});

io.on('connection', (socket) => {
    let addedUser = false;

    socket.on('new message', (msg) => {
        socket.broadcast.emit('new message', {
            msg: msg,
            username: socket.username
        });
    });

    socket.on('add user', (username) => {
        if (addedUser) return;

        socket.username = username;
        addedUser = true;
        socket.emit('login');
        socket.broadcast.emit('user joined', {
            username: socket.username
        });
    });

    socket.on('disconnect', () => {
        if (addedUser) {
            socket.broadcast.emit('user left', {
                username: socket.username
            });
        }
    });
});

http.listen(port, () => {
    console.log(`listening on port ${port}!`);
});