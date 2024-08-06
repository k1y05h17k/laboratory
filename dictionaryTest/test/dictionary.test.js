const request = require('supertest');
const chai = require('chai');
const expect = chai.expect;

describe('Dictionary API Integration Tests', function () {
    const apiBase = 'https://api.dictionaryapi.dev/api/v2/entries/en';
  
    it('should return word details for a valid word', function (done) {
      request(apiBase)
        .get('/hello')
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body).to.be.an('array');
          expect(res.body[0]).to.have.property('word', 'hello');
          done();
        });
    });
  
    it('should return 404 for an invalid word', function (done) {
      request(apiBase)
        .get('/nonexistentword123')
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(404);
          expect(res.body).to.have.property('title', 'No Definitions Found');
          done();
        });
    });
  
    // Simulando um erro de conexão à API
    it('should handle API downtime gracefully', function (done) {
      request('https://nonexistent.api.dev') // Endpoint inexistente para simular downtime
        .get('/entries/en/hello')
        .end((err, res) => {
          expect(err).to.not.be.null;
          expect(err.code).to.equal('ENOTFOUND');
          done();
        });
    });
  it('should return correct details for a plural word', function (done) {
    request(apiBase)
      .get('/dogs')
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).to.equal(200);
        expect(res.body[0].word).to.include('dogs');
        done();
      });
  });

  it('should return 404 for a word with special characters', function (done) {
    request(apiBase)
      .get('/!@#$%')
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).to.equal(404);
        expect(res.body).to.have.property('title', 'No Definitions Found');
        done();
      });
  });

  it('should handle multiple requests without error', function (done) {
    const requests = Array.from({ length: 10 }).map(() =>
      request(apiBase).get('/hello')
    );

    Promise.all(requests)
      .then((responses) => {
        responses.forEach((res) => {
          expect(res.status).to.equal(200);
        });
        done();
      })
      .catch(done);
  });

  it('should return 404 for non-existent endpoint', function (done) {
    request(apiBase)
      .get('/nonexistent-endpoint')
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).to.equal(404);
        done();
      });
  });
});