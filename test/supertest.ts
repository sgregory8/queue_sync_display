import supertest from 'supertest';

const PORT = Number(process.env.PORT) || 3010;
const baseUrl = `http://localhost:${PORT}`;

const supertestWrap = supertest(baseUrl);

export default supertestWrap;
