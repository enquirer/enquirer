'use strict';

/**
 * Create an instance of `Actions` with an instance of [prompt-base][].
 * Any of the methods may be overridden in custom prompts.
 *
 * ```js
 * const Actions = require('prompt-actions');
 * const Base = require('prompt-base');
 * const prompt = new Prompt('Favorite flavor?' ['chocolate', 'vanilla']);
 * const actions = new Actions(prompt);
 * ```
 * @param {Object} `prompt` Instance of [prompt-base][].
 * @api public
 */

class Actions {
  constructor(prompt) {
    this.prompt = prompt;
    this.options = prompt.options;
    this.state = prompt.state;
  }

  /**
   * Handle <kbd>number</kbd> keypress events. Toggles the choice at
   * corresponding row, starting at `1`. Because of this (1-based index)
   * we need to decrement the returned position by `1`, so that
   * the "real" position is correct.
   *
   * @return {Number} Returns `state.index`
   * @api public
   */

  number(pos, key) {
    const num = this.position(pos, key);
    if (num >= 0 && num <= this.choices.length) {
      this.state.index = num - 1;
      this.choices.radio();
    }
    return num - 1;
  }

  /**
   * Handle <kbd>space</kbd> keypress events. Toggles the choice at the
   * current position (e.g. on the same row as the pointer).
   *
   * @return {Number} Returns `state.index`
   * @api public
   */

  space(pos) {
    const num = this.position(pos);
    this.choices.radio();
    return num;
  }

  /**
   * Handle <kbd>tab</kbd> keypress events. By default, this is
   * just an identity function that returns the cursor position
   * on `tab` keypress events. This may be overridden in custom
   * prompts.
   *
   * ```js
   * const Prompt = require('prompt-base');
   * function MyPrompt() {
   *   Prompt.apply(this, arguments);
   *   this.action('tab', function() {
   *     // do custom tab stuff
   *   });
   * }
   * // inherit prompt-base
   * Prompt.extend(MyPrompt);
   * ```
   *
   * @return {Number} Returns `state.index`
   * @api public
   */

  tab() {
    this.next();
  }

  /**
   * Handle <kbd>a</kbd> keypress events. If all choices are already checked,
   * this will disable all choices. If zero to any other number of
   * choices is checked, this will enable all choices.
   *
   * @return {Number} Returns `state.index`
   * @api public
   */

  a() {
    this.choices[this.choices.all ? 'uncheck' : 'check']();
    this.choices.update();

    let enabled = this.isEnabled(this.state);
    this.each(ch => (ch.enabled = !enabled));
  }

  /**
   * Handle <kbd>i</kbd> keypress events. The <kbd>i</kbd>
   * keypress toggles all choices. If the pointer is inside a
   * choice group, only choices in that group will be toggled.
   *
   * @return {Number} Returns `state.index`
   * @api public
   */

  i(pos) {
    this.choices.toggle();
    this.choices.update();
    return this.position(pos);
  }

  /**
   * Handle <kdb>down</kdb> keypress events. <kdb>down</kdb> moves the
   * cursor down one row, and <kdb>shift</kdb>+<kdb>down</kdb> will
   * increase the number of rows visible in the terminal by one row.
   *
   * @return {Number} Returns the updated `state.index`.
   * @api public
   */

  down(pos, key) {
    const num = this.position(pos);
    if (key && key.shift === true) {
      if (this.options.expandChoices !== false) {
        return this.addRow();
      }
      this.moveDown(num);
    }
    return (num < this.choices.length - 1) ? num + 1 : 0;
  }

  /**
   * Handle <kdb>up</kdb> keypress events. <kdb>up</kdb> moves the
   * cursor up one row, and <kdb>shift</kdb>+<kdb>up</kdb> will
   * reduce the number of rows visible in the terminal by one row.
   *
   * @return {Number} Returns the updated `state.index`.
   * @api public
   */

  up(pos, key) {
    const num = this.position(pos);
    if (key && key.shift === true) {
      if (this.options.expandChoices !== false) {
        return this.removeRow();
      }
      this.moveUp(num);
    }
    return (num > 0) ? num - 1 : this.choices.length - 1;
  }

  /**
   * Move the currently selected item up.
   */

  moveUp(pos) {
    const len = this.choices.length;
    const num = this.position(pos);
    if (num > 0) {
      this.choices.swap(num - 1, num);
    } else {
      this.choices.swap(num, len - 1);
    }
    return num;
  }

  /**
   * Move the currently selected item down.
   */

  moveDown(pos) {
    const len = this.choices.length;
    const num = this.position(pos);
    if (num < len - 1) {
      this.choices.swap(num + 1, num);
    } else {
      this.choices.swap(num, 0);
    }
    return num;
  }

  /**
   * Move the currently selected item up.
   */

  addRow() {
    if (this.state.limit < this.choices.length) {
      this.state.limit++;
    } else {
      this.prompt.alert();
    }
  }

  /**
   * Move the currently selected item up.
   */

  removeRow() {
    if (this.state.limit > 0) {
      this.state.limit--;
    }
  }

  /**
   * Handle <kbd>enter</kbd> keypress events. By default this is a
   * noop since <kbd>enter</kbd> keypress events are typically ignored
   * to allow the `line` event to be handled when an answer is submitted.
   *
   * @return {Number} Returns `state.index`
   * @api public
   */

  enter(pos, key) {
    return this.position(pos);
  }

  /**
   * Returns the current choices position
   *
   * @return {Number} Returns `state.index`
   * @api public
   */

  identity(pos) {
    return pos;
  }

  /**
   * Helper for getting the current corsor position.
   *
   * @param {Number} `pos` (optional) Current position
   * @return {Number} Returns given `pos` or `state.index`
   * @api public
   */

  position(pos, key) {
    if (key && key.name === 'number' && key.hasOwnProperty('value')) {
      pos = Number(key.value);
    }
    if (typeof pos === 'number') {
      if (pos >= 0 && pos <= this.choices.length) {
        this.state.index = pos;
      }
      return pos;
    }
    return this.state.index;
  }

  /**
   * Get the choices array from the question.
   *
   * @name .choices
   * @return {Object} Choices object
   * @api public
   */

  set choices(choices) {
    this.prompt.choices = choices;
  }
  get choices() {
    return this.prompt.choices;
  }
}

/**
 * Expose `Actions`
 */

module.exports = Actions;
