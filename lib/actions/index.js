'use strict';

module.exports = {
  array: require('./array'),
  number: require('./number'),
  string: require('./string'),
  mixin(prompt, actions) {
    for (let key of Object.keys(actions)) {
      if (prompt[key] === void 0) {
        prompt[key] = actions[key].bind(null, prompt);
      }
    }
  }
};
