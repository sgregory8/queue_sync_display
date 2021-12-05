import { socket as _socket } from 'zeromq';
const { networkInterfaces } = require('os');
import { EventEmitter } from 'events';

/**
 * @param {zmq.Socket} socket .
 * @param {string} fullUrl .
 * @returns {Promise<void>} .
 */
function socket_bind(socket, fullUrl) {
    return new Promise((resolve, reject) => socket.bind(fullUrl, err => (err ? reject(err) : resolve())));
}

class ZmqProducer extends EventEmitter {
    /**
     * @param {number} port .
     * @param {string=} inputAddress .
     * @returns {Promise<{ socket: zmq.Socket, address: string }>} .
     * @private
     */
    async init(port) {
        const socket = _socket('pub');

        const address = getAddressFromNetworkInterface();

        const fullUrl = `tcp://${address}:${port}`;
        await socket_bind(socket, fullUrl);

        this.emit('connect', fullUrl);
        return { socket, address: fullUrl };
    }

    /**
     * @param {number} port .
     * @param {string=} address .
     */
    constructor(port, address) {
        super();
        /** @private */
        this.connection = this.init(port, address);

        /** @typedef {(event: 'connect' | 'disconnect', callback: (string: address) => void) => this} OnEvent */
        /** @type {OnEvent} */
        this.on;
        /** @type {OnEvent} */
        this.addListener;

        /** @typedef {(event: 'connect' | 'disconnect', address: string) => boolean} EmitEvent */
        /** @type {EmitEvent} */
        this.emit;
    }

    async disconnect() {
        const { socket, address } = await this.connection;
        await socket.unbind(address);
        this.emit('disconnect', address);
    }

    async getAddress() {
        const { address } = await this.connection;
        return address;
    }

    /**
     * @param  {...(string|Buffer|number)} params .
     */
    async send(...params) {
        const { socket } = await this.connection;
        socket.send(params);
    }
}

export default ZmqProducer;

const nets = networkInterfaces();
const results = Object.create(null); // Or just '{}', an empty object

for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
        // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
        if (net.family === 'IPv4' && !net.internal) {
            if (!results[name]) {
                results[name] = [];
            }
            results[name].push(net.address);
        }
    }
}

const getAddressFromNetworkInterface = () => {
    const networkInterfaces = Object.keys(results);
    console.log('found network interfaces:', networkInterfaces);
    const wlpInterface = networkInterfaces.find(ni => ni.startsWith('wlp'));
    if (wlpInterface) {
        return results[wlpInterface][0];
    }
    if (results && results.wlo1) {
        return results.wlo1[0];
    }
    if (results && results.en0) {
        return results.en0[0];
    }
    if (results && results.eth0) {
        return results.eth0[0];
    } else throw 'Unable to find a network interface.';
};
