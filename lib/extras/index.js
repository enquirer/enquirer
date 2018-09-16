'use strict';

define(exports, 'delay', () => require('./delay'));
define(exports, 'flash', () => require('./flash'));
define(exports, 'history', () => require('./history'));

function define(obj, key, get) {
  Reflect.defineProperty(obj, key, { get });
}
