'use strict';

const toString = str => str ? String(str) : '';
const unique = arr => arr.filter((v, i) => arr.lastIndexOf(v) === i);

module.exports = (action, data = {}, value = data.present) => {
  let { past = [], present = '' } = data;
  let rest, prev;

  switch (action) {
    case 'undo':
      rest = past.slice(0, past.length - 1);
      prev = past[past.length - 1];
      return {
        past: unique([value, ...rest]),
        present: toString(prev)
      };

    case 'redo':
      rest = past.slice(1);
      prev = past[0];
      return {
        past: unique([...rest, value]),
        present: toString(prev)
      };

    case 'save':
      return {
        past: unique([...past, value]),
        present: ''
      };

    case 'remove':
      prev = unique(past.filter(v => v !== value));
      present = '';

      if (prev.length) {
        present = prev.pop();
      }

      return {
        past: prev,
        present
      };

    default: {
      throw new Error(`Invalid action: "${action}"`);
    }
  }
};
