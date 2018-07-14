'use strict';

const types = require('prompt-base/lib/types');

/**
 * Base prompt
 */

define(exports, 'prompt', () => require('prompt-base'));

/**
 * Low-level types
 */

define(exports, 'array', () => types.array);
define(exports, 'boolean', () => types.boolean);
define(exports, 'number', () => types.number);
define(exports, 'string', () => types.string);

/**
 * User prompts
 */

define(exports, 'autocomplete', () => require('./autocomplete'));
define(exports, 'confirm', () => require('./confirm'));
define(exports, 'invisible', () => require('./invisible'));
define(exports, 'list', () => require('./list'));
define(exports, 'multiselect', () => require('./multiselect'));
define(exports, 'password', () => require('./password'));
define(exports, 'select', () => require('./select'));
define(exports, 'text', () => require('./text'));
define(exports, 'toggle', () => require('./text'));

function define(obj, key, get) {
  Reflect.defineProperty(obj, key, { get });
}
