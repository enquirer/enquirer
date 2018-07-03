'use strict';

module.exports = function(assert) {
  const utils = {};
  utils.press = require('./press');
  utils.expect = (expected, msg) => actual => assert.deepEqual(actual, expected, msg);
  utils.nextTick = fn => {
    return new Promise((resolve, reject) => {
      process.nextTick(() => fn().then(resolve).catch(reject));
    });
  };

  utils.timeout = (fn, ms = 0) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => fn().then(resolve).catch(reject), ms);
    });
  };

  assert.has = function(a, b, msg) {
    if (Array.isArray(a)) {
      assert(Array.isArray(b), 'expected an array');
      for (let i = 0; i < b.length; i++) assert.has(a[i], b[i], msg);
      return;
    }
    if (typeof a === 'string') {
      assert.equal(typeof b, 'string', 'expected a string');
      assert(a.includes(b), msg);
      return;
    }

    for (const key of Object.keys(b)) {
      assert.deepEqual(a[key], b[key], msg);
    }
  };

  return utils;
};
