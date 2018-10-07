'use strict';

const elements = require('./elements');
const styles = require('./styles');
const symbols = require('./symbols');
const transform = require('./transform');
const utils = require('../utils');

module.exports = prompt => {
  let theme = prompt.options.theme;
  if (theme) {
    delete prompt.options.theme;
    prompt.options = utils.merge({}, theme, prompt.options);
  }
  prompt.styles = styles.merge(prompt);
  prompt.symbols = symbols.merge(prompt);
  prompt.elements = elements(prompt);
  prompt.transform = transform(prompt);
  prompt.scale = prompt.transform.scale;
};
