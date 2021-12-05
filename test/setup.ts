import { startServer } from '../server/src/server';
import { CustomNodeJsGlobal } from '../server/types/supertest';

declare const global: CustomNodeJsGlobal;

async function setup() {
    const server = startServer();
    console.log('\nTest setup: Started the server.\n');

    /** we'll use this in `teardown.js` to close the server */
    global.server = server;
}

module.exports = setup;
