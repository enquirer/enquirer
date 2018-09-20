'use strict';

const { cyan, dim, red } = require('ansi-colors');
const Prompt = require('..');
const spinner = require('@sellside/spinner');

const spin = (output, msg) => {
  const end = spinner(msg, { output, interval: 60, frame: ele => cyan(ele) });
  return new Promise(res => setTimeout(() => res(end('  ' + msg)), 1000));
};

class LazyChoices extends Prompt {
  constructor(options = {}) {
    super(options);
    this.hint = options.hint || '';
    this.footer = dim('(Scroll up and down to reveal more choice)');
    this.queue = [].concat(this.options.choices || []);
    this.choices = [];
    this.cursor = 0;
    this.spin = value => {
      return spin(this.output, value, ' ' + value).then(() => value);
    };
  }

  moveCursor(i) {
    if (i < 0) i = this.choices.length - 1;
    if (i === this.choices.length) i = 0;
    this.cursor = i;
  }

  up() {
    this.moveCursor(this.cursor - 1);
    this.render();
  }
  down() {
    this.moveCursor(this.cursor + 1);
    this.render();
  }

  async toChoice(choice) {
    if (typeof choice === 'string') choice = { name: choice, value: choice };
    choice.name = choice.name || choice.value;
    choice.value = choice.value || choice.name;
    choice.index = this.choices.length;
    if (!choice.message) {
      return this.spin(choice.value).then(() => (choice.message = choice.value));
    }
    return choice;
  }

  renderChoice(choice, i) {
    let on = this.cursor === i;
    let pointer = cyan(this.symbols.pointer[on ? 'on' : 'off']);
    let message = on ? cyan(choice.message) : choice.message;
    return [pointer, message].join(' ');
  }

  renderChoices() {
    let visible = this.choices.map(this.renderChoice.bind(this));
    return visible.length ? ('\n' + visible.join('\n')) : '';
  }

  renderFooter() {
    return !this.answered && this.footer ? ('\n' + this.footer) : '';
  }

  async render(help) {
    const render = async() => {
      this.clear();
      this.cursorHide();

      let waiting = red('Please wait until all choices are loaded');
      let value = this.selected ? cyan(this.selected.value) : '';
      let hint = !this.queue.length ? this.renderHelp(help) : waiting;

      this.write(this.renderHeader());
      this.write(this.renderMessage(value, help));
      this.write(await this.renderChoices());
      this.write(this.renderFooter());

      if (this.queue.length) {
        this.online = this.offline();
        let choice = await this.toChoice(this.queue.shift());
        this.choices.push(choice);
        this.str += '\n';
        return render();
      }
    };

    await render();

    if (this.online) {
      this.online = this.online();
    }
  }

  offline() {
    let { up, down, submit } = this;
    this.up = () => this.alert();
    this.down = () => this.alert();
    this.submit = () => this.alert();
    return () => {
      this.submit = submit.bind(this);
      this.down = down.bind(this);
      this.up = up.bind(this);
    };
  }

  get selected() {
    return this.choices[this.cursor];
  }

  submit() {
    this.value = this.selected.value;
    return super.submit();
  }
}

module.exports = LazyChoices;
