'use strict';

const Events = require('events');

class InputStream extends Events {
  write(str) {
    this.emit('write', str);
  }

  close() {
  }
}

class OutputStream extends Events {
  write(str) {
    this.emit('write', str);
  }

  close() {
  }
}

function listener(input, onKeypress) {
  input.on('keypress', onKeypress);

  const off = () => {
    input.off('keypress', onKeypress);
  };

  return off;
}

let input = new InputStream();

listener(input, function onKeypress(s, key) {
  console.log([s, key]);
});

module.exports = Emitter;
