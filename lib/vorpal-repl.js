'use strict';

/**
 * Module dependencies.
 */

const _ = require('lodash');
const chalk = require('chalk');
const safeStringify = require('json-stringify-safe');

/**
 * Expose a function that passes in a Vantage
 * object and options.
 */

module.exports = function (vantage) {
  vantage
    .mode('repl', 'Enters REPL mode.')
    .delimiter('repl:')
    .init(function (args, cb) {
      this.log('Entering REPL Mode. To exit, type \'exit\'');
      cb(undefined, 'Entering REPL Mode. To exit, type \'exit\'.');
    })
    .action(function (command, cb) {
      const self = this;
      // @
      const globalEval = eval;
      try {
        const res = globalEval(command);
        let log = _.isString(res) ? chalk.white(res) : res;
        if (_.isObject(log) && !_.isArray(log)) {
          try {
            log = safeStringify(log, null, 2);
          } catch (error) {
            console.log(error.stack);
          }
        }

        self.log(log);
        cb(undefined, res);
      } catch (error) {
        self.log(error);
        cb(error);
      }
    });
};
