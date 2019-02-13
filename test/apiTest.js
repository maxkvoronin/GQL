const request = require('supertest');
const app = require('../app');

const agent = request.agent(app);

process.env.NODE_ENV = 'test';

describe('GET /api/posts/', function () {
    it('respond with json containing a list of all posts', function (done) {
        agent
            .get('/api/posts')
            .set('Accept', 'application/json')
            .set('Authorization', 'JWT ' + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdmF0YXJVcmwiOiJpbWFnZXMvdGVybS5qcGVnIiwiX2lkIjoiNWM2MjkwOTk2NDE5NzUxMTM0N2MzYmE4IiwidXNlcm5hbWUiOiJ0ZXN0IiwicGFzc3dvcmQiOiIkMmEkMTAkSUNkL2ljaUJxSFEvaG9IdnhYeFVwLk5lRkNIei5sYy5XdjBUYUVSTXYvYlovL0RzemhwMi4iLCJmaXJzdE5hbWUiOiJtYXgiLCJsYXN0TmFtZSI6InZvciIsImRlc2NyaXB0aW9uIjoiMSIsImVtYWlsIjoibWF4a3Zvcm9uaW5AZ21haWwuY29tIiwiaWF0IjoxNTQ5OTYzNDI2LCJleHAiOjE1NTAwNDk4MjZ9.ljevBkIqXvI01BLw3uTrA-M-yuR6zpstXIPHhb6vN9c')
            .expect('Content-Type', /json/)
            .expect(200, done);
    });
});

describe('POST /api/posts/', function () {
    it('create post', function (done) {
        agent
            .post('/api/posts')
            .field('text', '111222333')
            .field('picture', 'a.jpg')
            .set('Accept', 'application/json')
            .set('Authorization', 'JWT ' + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdmF0YXJVcmwiOiJpbWFnZXMvdGVybS5qcGVnIiwiX2lkIjoiNWM2MjkwOTk2NDE5NzUxMTM0N2MzYmE4IiwidXNlcm5hbWUiOiJ0ZXN0IiwicGFzc3dvcmQiOiIkMmEkMTAkSUNkL2ljaUJxSFEvaG9IdnhYeFVwLk5lRkNIei5sYy5XdjBUYUVSTXYvYlovL0RzemhwMi4iLCJmaXJzdE5hbWUiOiJtYXgiLCJsYXN0TmFtZSI6InZvciIsImRlc2NyaXB0aW9uIjoiMSIsImVtYWlsIjoibWF4a3Zvcm9uaW5AZ21haWwuY29tIiwiaWF0IjoxNTQ5OTYzNDI2LCJleHAiOjE1NTAwNDk4MjZ9.ljevBkIqXvI01BLw3uTrA-M-yuR6zpstXIPHhb6vN9c')
            .expect(201)
            .end(function(err, res) {
                if (err) return done(err);
                done();
            });
    });
});


