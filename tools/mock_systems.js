// outputs ZMQ messages once per second
const TIMESTAMP_OFFSET_MS = 0;

import ZmqProducer from './lib/zmqProducer';

const socketA = new ZmqProducer(20001).on('connect', address =>
    console.debug('System A - ZMQ producer running ' + address),
);
const socketB = new ZmqProducer(20002).on('connect', address =>
    console.debug('system B - ZMQ producer running ' + address),
);

const sendMessage = (topicName, socket, data) => {
    // socket.send(topicName, timestamp, room, JSON.stringify(data));
    socket.send(topicName, JSON.stringify(data));
    // console.log({ topicName, room, timestamp, data: JSON.stringify(data) });
};

setInterval(() => {
    var aObj = {};
    var bObj = {};

    const room = {
        label: 'Room 1',
        ward: 'Oakley Ward',
    };

    aObj.room = room;
    bObj.room = room;

    const timestamp = Date.now();

    aObj.timestamp = timestamp;
    bObj.timestamp = timestamp;

    const aData = {
        hr: randomIntBetween(6, 40),
        br: randomIntBetween(40, 160),
        location: 'InBed',
    };

    const bData = {
        movement: randomIntBetween(0, 10),
    };

    aObj.data = aData;
    bObj.data = bData;

    sendMessage('System A', socketA, aObj);
    setTimeout(() => sendMessage('System B', socketB, bObj), randomIntBetween(0, 1500));
}, 1000);

function randomIntBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
