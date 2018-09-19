'use strict';

const utils = require('../utils');

const define = (key, fn) => {
  utils.defineExport(exports, key, fn);
  let lower = key.toLowerCase();
  if (lower !== key) {
    utils.defineExport(exports, lower, fn);
  }
};

define('AutoComplete', () => require('./autocomplete'));
define('Confirm', () => require('./confirm'));
define('Form', () => require('./form'));
define('Input', () => require('./input'));
define('Invisible', () => require('./invisible'));
define('List', () => require('./list'));
define('MultiList', () => require('./multilist'));
define('MultiSelect', () => require('./multiselect'));
define('Number', () => require('./number'));
define('Password', () => require('./password'));
define('Radio', () => require('./radio'));
define('Rawlist', () => require('./rawlist'));
define('Select', () => require('./select'));
define('Snippet', () => require('./snippet'));
define('Sort', () => require('./sort'));
define('Text', () => require('./text'));
define('Toggle', () => require('./toggle'));
define('ToggleList', () => require('./toggle-list'));
