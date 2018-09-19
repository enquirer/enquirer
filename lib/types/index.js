'use strict';

const define = (obj, key, fn) => {
  Reflect.defineProperty(obj, key, { get: fn, enumerable: true });
};

define(exports, 'ArrayPrompt', () => require('./array'));
define(exports, 'BooleanPrompt', () => require('./boolean'));
define(exports, 'DatePrompt', () => require('./date'));
define(exports, 'NumberPrompt', () => require('./number'));
define(exports, 'StringPrompt', () => require('./string'));
