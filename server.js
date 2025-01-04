import { WebSocketServer } from 'ws';
import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
dotenv.config();


const app = express();
const port = process.env.PORT || 8080;

// Логирование запросов
app.use(morgan('dev'));

// Пример маршрута
app.get('/', (req, res) => {
    res.send('Hello from Express!');
});

// Запуск HTTP сервера
const server = app.listen(port, () => {
    console.log(`HTTP server running on http://localhost:${port}`);
});

// WebSocket сервер на том же порту
const wsServer = new WebSocketServer({ server });

wsServer.on('connection', (ws, req) => {
    const clientId = req.socket.remoteAddress;
    console.log(`WebSocket client connected: ${clientId}`);

    ws.send(JSON.stringify({ type: 'sessions', count: 1 }));

    ws.on('message', (message) => {
        console.log(`Received message from ${clientId}:`, message);
    });

    ws.on('close', () => {
        console.log(`WebSocket client disconnected: ${clientId}`);
    });
});

// Обработка ошибок
server.on('error', (error) => {
    console.error(`Server error: ${error.message}`);
});

console.log(`WebSocket server running on ws://localhost:${port}`);
