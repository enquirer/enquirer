'use strict';

const utils = require('../utils');

module.exports = function(prompt) {
  let interval = prompt.options.interval || 100;
  let keypress = prompt.keypress;
  let dispatch = prompt.dispatch;

  prompt.stopDelay = () => {};
  prompt.dispatch = (...args) => {
    prompt.stopDelay();
    dispatch.call(prompt, ...args);
  };

  prompt.delay = () => {
    let stopDelay = prompt.stopDelay;
    let dispatchd = false;

    let dispatch = () => {
      prompt.stopDelay = stopDelay;
      if (!dispatchd) {
        dispatchd = true;
        prompt.dispatch(prompt.typed);
        prompt.typed = '';
      }
    };

    if (prompt.options.delay === false) {
      dispatch();
      return;
    }

    let fn = setTimeout(dispatch, interval);
    prompt.stopDelay = () => {
      dispatch();
      clearTimeout(fn);
    };

    return prompt.stopDelay;
  };

  prompt.keypress = async(ch, key) => {
    if (utils.isValidNumberKey(ch, prompt.choices)) {
      let len = prompt.choices.length;
      let lenStr = `${len}`;

      if (len < 10) {
        prompt.typed = '';
        prompt.stopDelay();
        prompt.dispatch(ch);
        return;
      }

      let typed = prompt.typed = `${prompt.typed}${ch}`;
      if (!utils.isValidNumberKey(typed, prompt.choices)) {
        prompt.typed = '';
        prompt.stopDelay();
        return prompt.alert();
      }

      if (typed[0] > lenStr[0]) {
        prompt.dispatch(ch);
        prompt.typed = '';
        prompt.stopDelay();
        return;
      }

      if (typed.length >= lenStr.length || typed > 9) {
        prompt.stopDelay();
        return;
      }

      prompt.stopDelay();
      prompt.delay();
      return;
    }

    prompt.typed = '';
    prompt.stopDelay();
    return keypress.call(prompt, ch, key);
  };

  prompt.keypress = prompt.keypress.bind(prompt);
};
