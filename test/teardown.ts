import { CustomNodeJsGlobal } from '../server/types/supertest';

declare const global: CustomNodeJsGlobal;

function teardown() {
    global.server.close(() => {
        console.log('\nTest teardown: Stopped the server.\n');
    });
}

module.exports = teardown;
