require('dotenv').config();

const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const GPTService = require('./gptService');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const gptService = new GPTService('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');

app.use(express.static('public'));

wss.on('connection', (ws) => {
    console.log('New client connected');

    ws.on('message', async (message) => {
        let parsedMessage;
        try {
            parsedMessage = JSON.parse(message);
        } catch (e) {
            ws.send(JSON.stringify({ userId: null, content: 'Invalid message format.' }));
            return;
        }
        const { userId, content } = parsedMessage;

        console.log(`Received message from user ${userId}: ${content}`);

        try {
            const response = await gptService.sendMessage(content);
            ws.send(JSON.stringify({ userId, content: response }));
        } catch (error) {
            console.error('Error processing message:', error);
            ws.send(JSON.stringify({ userId, content: 'Error processing your request.' }));
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
    console.log(process.env.OPENAI_API_KEY);
});