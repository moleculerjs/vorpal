'use strict';

require('assert');

const should = require('should');
const Vantage = require('../lib/vorpal');
const repl = require('../lib/vorpal-repl');

let vorpal;
let stdout = '';

global.foo = 'bar';
global.blob = {
  json: {uncle: 'sam', aunt: 'mary'},
  circular: {
    gotcha: undefined,
    innocent: 'bystander'
  }
};
global.blob.circular.gotcha = global.blob.circular;

function stdoutFn(data) {
  stdout += data;
  return '';
}

describe('vorpal-repl', () => {
  describe('root', () => {
    before('vorpal preps', () => {
      vorpal = new Vantage().pipe(stdoutFn).show();
    });

    beforeEach('vorpal preps', () => {
      stdout = '';
    });

    it('should exist and be a function', () => {
      should.exist(repl);
      repl.should.be.type('function');
    });

    it('should import into Vantage', () => {
      (function () {
        vorpal.use(repl);
      }).should.not.throw();
    });

    it('should log into REPL', done => {
      vorpal.exec('repl', (err, data) => {
        should.not.exist(err);
        data.should.containEql('Entering REPL Mode.');
        done();
      });
    });

    it('should execute JS', done => {
      vorpal.exec('Math.pow(6 * 6, 2);', (err, data) => {
        should.not.exist(err);
        data.should.equal(1296);
        done();
      });
    });

    it('should have access to global', done => {
      vorpal.exec('foo', (err, data) => {
        should.not.exist(err);
        data.should.equal('bar');
        done();
      });
    });

    it('should stringify JSON', done => {
      vorpal.exec('blob.json', err => {
        should.not.exist(err);
        stdout.replace(/\n/g, '').replace(/\\/g, '').should.equal('{  "uncle": "sam",  "aunt": "mary"}');
        done();
      });
    });

    it('should nail circular references like a boss', done => {
      vorpal.exec('blob.circular', err => {
        should.not.exist(err);
        done();
      });
    });
  });
});

