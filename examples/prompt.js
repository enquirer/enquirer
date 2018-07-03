const Prompt = require('prompt-base');
const prompt = new Prompt({
  value: 0,
  calls: 0,
  up() {
    this.value++;
    this.render();
  },
  down() {
    this.value--;
    this.render();
  },
  render() {
    this.clear();
    this.write(`value: ${this.value} | calls: ${this.calls++}`);
  }
});

prompt.run()
  .then(console.log).catch(console.error);
