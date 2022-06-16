import { dirname } from 'path';
import { fileURLToPath } from 'url';

const pwd = dirname(fileURLToPath(import.meta.url));

//const express = require('express');
//const http = require('http');
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
const PORT = +(process.env.PORT || 8000);

const io = new Server(server);
let connCount = 0;

app.get('/', (_req, res) => {
    res.sendFile(pwd + '/index.html');
});

io.on('connection', (socket) => {
    connCount += 1;
    const username = connCount;
    console.log(`User ${username} connected`);

    socket.broadcast.emit('userjoin', username);
    socket.emit('userId', username);

    socket.on('disconnect', () => {
        socket.broadcast.emit('userleave', username);
        console.log(`User ${username} disconnected`);
    })

    socket.on('chattoserver', (msg) => {
        console.log(`message from ${username}: ${msg}`);
        socket.broadcast.emit('chattoclient', username, msg);
    });
});

app.get('/:name', (req, res) => {
    res.send(`Hello ${req.params.name}`);
});

server.listen(PORT, _ => {
    console.log(`Listening on port ${PORT}`);
});
