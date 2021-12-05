import express from 'express';
import routes from './routes';
import * as http from 'http';
import WebSocket from 'ws';

import { logger } from './services';

import type { Server } from 'http';

const { Api_Port } = process.env;
const SYSTEM_A = 'System A';
const SYSTEM_B = 'System B';

const app = express();

const messageMap = new Map();

// initialize a simple http server
const server = http.createServer(app);

// initialize the WebSocket server instance
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws: WebSocket) => {
    // connection is up, add an event
    ws.on('message', (message: string) => {
        // log the received message
        logger.info(`received: ${message}`, message);
    });

    // send immediatly a feedback to the incoming connection
    ws.send('Connected');
});

wss.broadcast = function broadcast(message: string) {
    wss.clients.forEach((client: WebSocket) => client.send(message));
};

// register the health endpoint route
app.use('/api', routes);

function startServer(): Server {
    const PORT = Api_Port ? parseInt(Api_Port) : 3010;
    // start the server
    const ws_server = server.listen(PORT, () => {
        logger.info(`Server started on port ${PORT})`);
    });
    return ws_server;
}

function sendToClients(message: Object): void {
    wss.broadcast(JSON.stringify(message));
}

function checkAndUpdateMap(topic: string, message: Object) : void {
    if (topic === SYSTEM_A) {
        console.log('A message arrived');
        const existingMessage = messageMap.get(message.timestamp);
        if (existingMessage && !existingMessage.sent) {
            console.log('A message arrived, B already here sending a + b');
            sendToClients({ systemB: existingMessage.systemB, systemA: message });
            existingMessage.sent = true;
        } else {
            console.log('A message arrived, B not here waiting');
            setTimeout(() => {
                console.log('A message arrived, B not here wait over checking for b');
                const existingMessage = messageMap.get(message.timestamp);
                if (!existingMessage.systemB && !existingMessage.sent) {
                    console.log('B not here sending A on its own');
                    sendToClients({ systemA: message });
                    existingMessage.sent = true;
                }
            }, 800);
        }
        messageMap.set(message.timestamp, { systemA: message });
        return;
    } else {
        const existingMessage = messageMap.get(message.timestamp);
        if (existingMessage && !existingMessage.sent) {
            sendToClients({ systemA: existingMessage.systemA, systemB: message });
            existingMessage.sent = true;
            return;
        } else {
            messageMap.set(message.timestamp, { systemB: message });
        }
    }
}

// grab zmq
const zmq = require('zeromq');
const sockA = zmq.socket('sub');

// subscribe to systemA
sockA.connect('tcp://192.168.1.16:20001');
sockA.subscribe('');
console.log('Worker connected to port 20001');

sockA.on('message', function (topic: any, msg: any) {
    const _message = JSON.parse(msg);
    checkAndUpdateMap(topic.toString(), _message);
});

const sockB = zmq.socket('sub');

// subscribe to systemB
sockB.connect('tcp://192.168.1.16:20002');
sockB.subscribe('');
console.log('Worker connected to port 20001');

sockB.on('message', function (topic: any, msg: any) {
    const _message = JSON.parse(msg);
    checkAndUpdateMap(topic.toString(), _message);
});

export { startServer };
