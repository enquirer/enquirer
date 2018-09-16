'use strict';

const actions = require('./actions');

module.exports = key => {
  if (key.ctrl && actions.ctrl[key.name]) {
    key.action = actions.ctrl[key.name];
    return key;
  }

  if (key.shift && actions.shift[key.name]) {
    key.action = actions.shift[key.name];
    return key;
  }

  key.action = actions.keys[key.name];
  return key;
};
