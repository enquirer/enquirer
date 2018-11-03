'use strict';

const utils = require('../utils');
const define = (key, fn) => {
  utils.defineExport(exports, key, fn);
  utils.defineExport(exports, key.toLowerCase(), fn);
};

define('AutoComplete', () => require('./autocomplete'));
define('Confirm', () => require('./confirm'));
define('Input', () => require('./input'));
define('Invisible', () => require('./invisible'));
define('List', () => require('./list'));
define('MultiSelect', () => require('./multiselect'));
define('Number', () => require('./number'));
define('Password', () => require('./password'));
define('Select', () => require('./select'));
define('Snippet', () => require('./snippet'));
define('Sort', () => require('./sort'));
define('Transition', () => require('./transition'));
define('Transition2', () => require('./transition2'));
define('Transition3', () => require('./transition3'));
define('Text', () => require('./text'));
