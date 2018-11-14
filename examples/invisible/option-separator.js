const { dim, cyan, red, green, yellow } = require('ansi-colors');
const Prompt = require('../../lib/prompts/invisible');
const prompt = new Prompt({
  name: 'secret',
  message: 'What is your secret?',
  separator() {
    if (this.state.submitted) {
      return cyan(this.symbols.bullet);
    }
    return this.typed ? green(this.symbols.bullet) : dim(this.symbols.bullet);
  }
});

prompt.run()
  .then(answer => console.log('Answer:', [answer]))
  .catch(console.error);
