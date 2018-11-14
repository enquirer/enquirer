const { Prompt } = require('..');

class HaiKarate extends Prompt {
  constructor(options = {}) {
    super(options);
    this.value = options.initial || 0;
    this.cursorHide();
  }
  up() {
    this.value++;
    this.render();
  }
  down() {
    this.value--;
    this.render();
  }
  render() {
    this.clear(); // clear previously rendered prompt from the terminal
    this.write(`${this.state.message}: ${this.value}`);
  }
}

const prompt = new HaiKarate({
  message: 'How many sprays do you want?',
  sprays: 10
});

prompt.run()
  .then(console.log).catch(console.error);
