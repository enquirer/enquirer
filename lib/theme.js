'use strict';

const styles = require('./styles');
const symbols = require('./symbols');
const transform = require('./transform');
const utils = require('./utils');

module.exports = prompt => {
  prompt.options = utils.merge({}, prompt.options.theme, prompt.options);
  prompt.transform = transform.merge(prompt.options);
  prompt.symbols = symbols.merge(prompt.options);
  prompt.styles = styles.merge(prompt.options);
};
