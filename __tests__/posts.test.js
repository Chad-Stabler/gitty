const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const agent = request.agent(app);

jest.mock('../lib/services/github');

describe('backend-express-template routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  it('should return posts for logged in user', async () => {
    await agent.get('/api/v1/github/callback?code=42');
    const res = await agent.get('/api/v1/posts');
    expect(res.body).toEqual(expect.arrayContaining([{
      post: expect.any(String)
    }]));
  });
  it('should not return posts for unauth users', async () => {
    await agent.delete('/api/v1/github/callback');
    const res = await agent.get('/api/v1/posts');
    expect(res.status).toBe(401);
  });
  it('should create post for auth users', async () => {
    const post = { post: 'Chad has created his first post' };
    await agent.get('/api/v1/github/callback?code=42');
    const res = await agent.post('/api/v1/posts').send(post);
    expect(res.body).toEqual(
      {
        id: expect.any(String),
        post: 'Chad has created his first post'
      }
    );
    
  });
  it('should not create post for unauth users', async () => {
    await agent.delete('/api/v1/github/callback');
    const res = await agent.post('/api/v1/posts').send({ post: 'this should get blocked' });
    expect(res.status).toBe(401);
  });
  afterAll(() => {
    pool.end();
  });
});
