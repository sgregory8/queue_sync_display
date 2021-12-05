import type { Server } from 'http';
import superagent from 'superagent';

declare module 'supertest' {
    interface Test extends superagent.SuperAgentRequest {
        authenticate(user: string): this;
    }
}

export interface CustomNodeJsGlobal extends NodeJS.Global {
    server: Server;
}
