const Store = require('data-store');
const Input = require('../lib/prompts/input');
const completer = require('./completer');

class Text extends Input {
  constructor(options) {
    super(options);

    let history = this.options.history;
    if (history && history.store) {
      this.autosave = !!history.autosave;
      this.store = history.store;
      this.data = this.store.get('values') || { past: [], present: this.initial };
      this.initial = this.data.present || this.data.past[this.data.past.length - 1];
    }
  }

  complete(action) {
    if (!this.store) return this.alert();
    this.data = completer(action, this.data, this.input);
    if (!this.data.present) return this.alert();
    this.input = this.data.present;
    this.cursor = this.input.length;
    this.render();
  }

  up() {
    return this.complete('prev');
  }

  down() {
    return this.complete('next');
  }

  prev() {
    this.save();
    super.prev();
  }

  save() {
    this.data = completer('save', this.data, this.input);
    this.store.set('values', this.data);
  }

  submit() {
    let value = super.submit();
    if (this.autosave === true) {
      this.save();
    }
    return value;
  }
}

const prompt = new Text({
  name: 'username',
  message: 'GitHub username?',
  initial: 'jonschlinkert',
  history: {
    store: new Store({ path: `${__dirname}/username.json` }),
    autosave: true
  }
});

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
