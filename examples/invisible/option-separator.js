'use strict';

const { dim, cyan, green } = require('ansi-colors');
const { Invisible } = require('enquirer');

const prompt = new Invisible({
  name: 'secret',
  message: 'What is your secret?',
  separator() {
    let bullet = this.symbols.bullet;
    if (this.state.submitted) return cyan(bullet);
    return this.typed ? green(bullet) : dim(bullet);
  }
});

prompt.run()
  .then(answer => console.log('Answer:', [answer]))
  .catch(console.error);
