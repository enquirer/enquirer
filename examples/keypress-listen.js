'use strict';

const { listen } = require('../lib/keypress');
const history = require('../lib/extras/history6');
const actions = require('../lib/action');

const Store = require('data-store');
const store = new Store({ path: __dirname + '/history-store.json' });
let data = store.get('name', { past: [], present: '' });

console.log(data);
console.log(data.present);

const stopListening = listen(process.stdin, key => {
  let { raw, action } = actions(key);

  switch (action) {
    case 'cancel':
    case 'submit':
      console.log();
      store.set('name', data);
      return stopListening();
    case 'save':
      data = history('save', data);
      store.set('name', data);
      break;
    case 'remove':
      data = history('remove', data);
      break;
    case 'shiftUp':
      data = history('undo', data);
      break;
    case 'shiftDown':
      data = history('redo', data);
      break;
    case 'delete':
      data.present = data.present.slice(0, -1);
      break;
    default: {
      if (raw && !key.code && !key.ctrl && !key.shift && !key.meta) {
        data.present += raw;
      }
      break;
    }
  }

  console.log(data);
  console.log(data.present);
});

const decorate = (key, prompt) => {
  let { action, raw } = key;

  switch (action) {
    case 'cancel':
    case 'submit':
      console.log();
      store.set('name', data);
      return stopListening();
    case 'save':
      data = history('save', data);
      store.set('name', data);
      break;
    case 'remove':
      data = history('remove', data);
      break;
    case 'shiftUp':
      data = history('undo', data);
      break;
    case 'shiftDown':
      data = history('redo', data);
      break;
    case 'delete':
      data.present = data.present.slice(0, -1);
      break;
    default: {
      if (raw && !key.ctrl && !key.shift && !key.meta) {
        data.present += raw;
      }
      break;
    }
  }
};
