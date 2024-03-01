import express from 'express';
import { Server } from 'socket.io';
import { createServer } from 'http';


const app = express()
const PORT = 3005;
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173', // allow all
        methods: ["GET", "POST"],
        credentials: true
    }

});
app.get('/', (req, res) => {
    res.send('Hello World')
})

io.on('connection', (socket) => {
    console.log('a user connected', socket.id);

    socket.on('send_message', ({ message, room }) => {
        if (room) {
            socket.to(room).emit('recive_message', { message });
        } else {
            socket.broadcast.emit('recive_message', { message });
        }
        console.log('message: ' + { message });
        // socket.broadcast.emit('message', message);
        // if (room) {
        //     io.to(room).emit('message', message);
        // }else{
        //     io.emit('message', message);

        // }
    });
    socket.on('join_room', (room) => {
        socket.join(room);
        console.log('joined room', room);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected', socket.id);
    });

})

server.listen(PORT, () => {
    console.log(`Server start at http://localhost:${PORT}`)
})