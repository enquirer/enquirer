'use strict';

const roles = {
  option: {},
  separator: {},
  heading: {},
  spacer: {}
};

module.exports = name => {
  return roles[name];
};
