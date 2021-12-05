import supertest from '../../../test/supertest';

describe('/heartbeat API', () => {
    it('should return a pong', async () => {
        expect.assertions(3);
        try {
            const res = await supertest.get('/api/v1/heartbeat');

            expect(res.status).toBe(200);

            expect(res.body).toHaveProperty('ping');
            expect(res.body.ping).toBe('pong');
        } finally {
            //
        }
    });
});
