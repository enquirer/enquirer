'use strict';

const colors = require('ansi-colors');
const ArrayPrompt = require('../types/array');
const utils = require('../utils');

class LikertScale extends ArrayPrompt {
  constructor(options = {}) {
    super(options);
    this.widths = [].concat(options.messageWidth || 50);
    this.align = [].concat(options.align || 'left');
    this.linebreak = options.linebreak || false;
    this.edgeLength = options.edgeLength || 3;
    this.newline = options.newline || '\n   ';
    this.margin = toSpaces([options.margin, ' '].find(v => v != null));
  }

  async reset() {
    this.tableized = false;
    await super.reset();
    return this.render();
  }

  tableize() {
    if (this.tableized === true) return;
    this.tableized = true;
    for (let ch of this.choices) {
      ch.scaleIndex = ch.initial || 2;
      ch.scale = [];

      for (let i = 0; i < this.scale.length; i++) {
        ch.scale.push({ index: i });
      }
    }
  }

  async dispatch(s, key) {
    if (this.multiple) {
      return this[key.name] ? await this[key.name](s, key) : await super.dispatch(s, key);
    }
    this.alert();
  }

  heading(msg, item, i) {
    return this.styles.strong(msg);
  }

  separator() {
    return this.styles.muted(this.symbols.ellipsis);
  }

  right() {
    let choice = this.focused;
    if (choice.scaleIndex >= this.scale.length - 1) return this.alert();
    choice.scaleIndex++;
    return this.render();
  }

  left() {
    let choice = this.focused;
    if (choice.scaleIndex <= 0) return this.alert();
    choice.scaleIndex--;
    return this.render();
  }

  indent() {
    return '';
  }

  format() {
    if (this.state.submitted) {
      let values = this.choices.map(ch => this.styles.info(ch.index));
      return values.join(', ');
    }
    return '';
  }

  pointer() {
    return '';
  }

  /**
   * Render the scale "Key". Something like:
   * @return {String}
   */

  renderScaleKey() {
    if (this.state.submitted) return '';
    let scale = this.scale.map(item => `   ${item.name} - ${item.message}`);
    let key = ['', ...scale].map(item => this.styles.muted(item));
    return key.join('\n');
  }

  /**
   * Render the heading row for the scale.
   * @return {String}
   */

  renderScaleHeading(max) {
    let edgeLength = this.edgeLength + 1;
    let keys = this.scale.map(ele => ele.name);
    let diff = this.scaleLength - keys.join('').length;
    let spacing = Math.round(diff / (keys.length - 1));
    let names = keys.map(key => this.styles.strong(key));
    let headings = names.join(' '.repeat(spacing));
    let padding = ' '.repeat(this.widths[0]);
    return padding + this.margin + headings;
  }

  /**
   * Render a scale indicator => ◯ or ◉ by default
   */

  scaleIndicator(choice, item, i) {
    let enabled = choice.scaleIndex === item.index;
    if (item.disabled) return this.styles.hint(this.symbols.radio.disabled);
    if (enabled) return this.styles.success(this.symbols.radio.on);
    return this.symbols.radio.off;
  }

  /**
   * Render the actual scale => ◯────◯────◉────◯────◯
   */

  renderScale(choice, i) {
    let scale = choice.scale.map(item => this.scaleIndicator(choice, item, i));
    let padding = this.term === 'Hyper' ? '' : ' ';
    return scale.join(padding + this.symbols.line.repeat(this.edgeLength));
  }

  /**
   * Render a choice, including scale =>
   *   "The website is easy to navigate. ◯───◯───◉───◯───◯"
   */

  async renderChoice(choice, i) {
    await this.onChoice(choice, i);

    let focused = this.index === i;
    let pointer = await this.pointer(choice, i);
    let hint = await choice.hint;

    if (hint && !utils.hasColor(hint)) {
      hint = this.styles.muted(hint);
    }

    let pad = str => str.replace(/\s+$/, '').padEnd(this.widths[0], ' ');
    let newline = this.newline;
    let ind = this.indent(choice);
    let message = await this.resolve(choice.message, this.state, choice, i);
    let scale = await this.renderScale(choice, i);
    this.scaleLength = colors.unstyle(scale).length;
    this.widths[0] = Math.min(this.widths[0], this.width - this.scaleLength - this.margin.length);
    let msg = utils.wordWrap(message, { width: this.widths[0], newline });
    let lines = msg.split('\n').map(line => pad(line) + this.margin);
    let longest = lines.reduce((a, l) => Math.max(a, l.length), 0);

    if (focused) {
      scale = this.styles.info(scale);
      lines = lines.map(line => this.styles.info(line));
    }

    lines[0] += scale;
    if (this.linebreak) lines.push('');
    return [ind + pointer, lines.join('\n')].filter(Boolean);
  }

  async renderChoices() {
    if (this.state.submitted) return '';
    this.tableize();
    let choices = this.visible.map(async(ch, i) => await this.renderChoice(ch, i));
    let visible = await Promise.all(choices);
    let messages = visible.map(line => line.slice(0, line.length - 1));
    let heading = await this.renderScaleHeading();
    return [heading, ...visible.map(v => v.join(' '))].join('\n');
  }

  async render() {
    let { submitted, size } = this.state;

    let prefix = await this.prefix();
    let separator = await this.separator();
    let message = await this.message();

    let prompt = '';
    if (this.options.promptLine !== false) {
      prompt = [prefix, message, separator, ''].join(' ');
      this.state.prompt = prompt;
    }

    let header = await this.header();
    let output = await this.format();
    let key = await this.renderScaleKey();
    let help = await this.error() || await this.hint();
    let body = await this.renderChoices();
    let footer = await this.footer();
    let err = this.emptyError;

    if (output) prompt += output;
    if (help && !prompt.includes(help)) prompt += ' ' + help;

    if (submitted && !output && !body.trim() && this.multiple && err != null) {
      prompt += this.styles.danger(err);
    }

    this.clear(size);
    this.write([header, prompt, key, body, footer].filter(Boolean).join('\n'));
    this.restore();
  }

  submit() {
    this.value = {};
    for (let choice of this.choices) {
      this.value[choice.name] = choice.scaleIndex;
    }
    return this.base.submit.call(this);
  }
}

function toSpaces(value) {
  if (typeof value === 'number') {
    return ' '.repeat(value);
  }
  if (typeof value === 'string') {
    return value;
  }
  return '';
}

module.exports = LikertScale;
