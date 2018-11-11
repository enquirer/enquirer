'use strict';

const ArrayPrompt = require('../types/array');
const utils = require('../utils');

class LikertScale extends ArrayPrompt {
  constructor(options = {}) {
    super(options);
    this.maxMessageLength = options.maxMessageLength || 50;
    this.messageAlign = options.messageAlign || 'left';
    this.edgeLength = options.edgeLength || 3;
    this.newline = options.newline || '\n';
    this.margin = options.margin || '   ';
  }

  wrap(choice) {
    if (this.longestRow && choice.wrapped) return choice.wrapped;
    this.longestRow = 0;
    let wrapped;

    for (let ch of this.choices) {
      if (ch.wrapped) continue;
      let opts = { width: this.maxMessageLength, newline: this.newline };
      let val = utils.wordWrap(ch.message, opts);
      ch.rows = val.split('\n');
      this.longestRow = Math.max(this.longestRow, utils.longest(ch.rows));
    }

    for (let ch of this.choices) {
      ch.rows = ch.rows.map(row => row.padEnd(this.longestRow));
      ch.wrapped = ch.rows.join('\n');
      if (ch === choice) wrapped = ch.wrapped;
    }
    return wrapped;
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
    let alignRight = this.messageAlign === 'right';
    let pad = str => str[alignRight ? 'padStart' : 'padEnd'](max, ' ');
    let keys = this.scale.map(ele => ele.name);
    let names = keys.map(key => this.styles.strong(key));
    let len = keys.join('').length;
    let diff = Math.max(Math.round((len - this.scale.length) / this.scale.length), 0);
    let lead = ' '.repeat(this.longest + 1);
    let headings = names.join(' '.repeat(edgeLength - diff));
    return lead + headings;
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
    return scale.join(padding + this.symbols.line.repeat(4));
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

    let ind = this.indent(choice);
    let message = await this.resolve(choice.message, this.state, choice, i);
    // let msg = this.wrap(choice);
    let msg = choice.message;
    let margin = ' '.repeat(this.longest - choice.message.length);
    let scale = margin + this.renderScale(choice, i);

    if (focused) {
      scale = this.styles.info(scale);
      msg = this.styles.info(msg);
    }

    return [ind + pointer, msg, scale].filter(Boolean);
  }

  addScales() {
    if (this.addedScales) return;
    this.addedScales = true;

    this.choices.forEach(choice => {
      if (choice.scale) return;
      choice.scaleIndex = choice.initial || 2;
      choice.scale = [];
      for (let i = 0; i < this.scale.length; i++) {
        choice.scale.push({ index: i, enabled: false });
      }
    });
  }

  async renderChoices() {
    if (this.state.submitted) return '';
    this.addScales();
    let choices = this.visible.map(async(ch, i) => await this.renderChoice(ch, i));
    let visible = await Promise.all(choices);
    let messages = visible.map(row => row.slice(0, row.length - 1));
    let max = utils.longest(messages);
    let heading = await this.renderScaleHeading(max);
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

    if (output) prompt += output;
    if (help && !prompt.includes(help)) prompt += ' ' + help;

    if (submitted && !output && !body.trim() && this.multiple && this.emptyError != null) {
      prompt += this.styles.danger(this.emptyError);
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

module.exports = LikertScale;
