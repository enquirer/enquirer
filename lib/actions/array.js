'use strict';

const utils = require('../utils');

exports.a = prompt => {
  if (prompt.maxSelected < prompt.choices.length) return prompt.alert();
  let enabled = prompt.selectable.every(ch => ch.enabled);
  prompt.choices.forEach(ch => (ch.enabled = !enabled));
  return prompt.render();
};

exports.i = prompt => {
  // don't allow choices to be inverted if it will result in
  // more than the maximum number of allowed selected items.
  if (prompt.choices.length - prompt.selected.length > prompt.maxSelected) {
    return prompt.alert();
  }
  prompt.choices.forEach(ch => (ch.enabled = !ch.enabled));
  return prompt.render();
};

exports.g = (prompt, choice = prompt.focused) => {
  if (!prompt.choices.some(ch => !!ch.parent)) return prompt.a();
  prompt.toggle(choice.parent && !choice.choices ? choice.parent : choice);
  return prompt.render();
};

exports.toggle = (prompt, choice, enabled) => {
  if (!choice.enabled && prompt.selected.length >= prompt.maxSelected) {
    return prompt.alert();
  }

  if (typeof enabled !== 'boolean') enabled = !choice.enabled;
  choice.enabled = enabled;

  if (choice.choices) {
    choice.choices.forEach(ch => prompt.toggle(ch, enabled));
  }

  let parent = choice.parent;
  while (parent) {
    let choices = parent.choices.filter(ch => prompt.isDisabled(ch));
    parent.enabled = choices.every(ch => ch.enabled === true);
    parent = parent.parent;
  }

  utils.reset(prompt, prompt.choices);
  prompt.emit('toggle', choice, prompt);
  return choice;
};

exports.enable = (prompt, choice) => {
  if (prompt.selected.length >= prompt.maxSelected) return prompt.alert();
  choice.enabled = !prompt.isDisabled(choice);
  choice.choices && choice.choices.forEach(prompt.enable.bind(prompt));
  return choice;
};

exports.disable = (prompt, choice) => {
  choice.enabled = false;
  choice.choices && choice.choices.forEach(prompt.disable.bind(prompt));
  return choice;
};

exports.focus = (prompt, choice, enabled) => {
  if (typeof enabled !== 'boolean') enabled = choice.enabled;
  if (enabled && !choice.enabled && prompt.selected.length >= prompt.maxSelected) {
    return prompt.alert();
  }
  prompt.index = choice.index;
  choice.enabled = enabled && !prompt.isDisabled(choice);
  return choice;
};

exports.space = prompt => {
  if (!prompt.multiple) return prompt.alert();
  prompt.toggle(prompt.focused);
  return prompt.render();
};

exports.home = prompt => {
  prompt.choices = utils.reorder(prompt.choices);
  prompt.index = 0;
  return prompt.render();
};

exports.end = prompt => {
  let pos = prompt.choices.length - prompt.limit;
  let choices = utils.reorder(prompt.choices);
  prompt.choices = choices.slice(pos).concat(choices.slice(0, pos));
  prompt.index = prompt.limit - 1;
  return prompt.render();
};

exports.first = prompt => {
  prompt.index = 0;
  while (prompt.isDisabled(prompt.focused)) prompt.next();
  return prompt.render();
};

exports.last = prompt => {
  prompt.index = prompt.visible.length - 1;
  while (prompt.isDisabled(prompt.focused)) prompt.prev();
  return prompt.render();
};

exports.prev = prompt => {
  if (!prompt.visible) return prompt.alert();
  if (prompt.visible.length <= 1) return prompt.alert();
  return prompt.up();
};

exports.next = prompt => {
  if (!prompt.visible) return prompt.alert();
  if (prompt.visible.length <= 1) return prompt.alert();
  return prompt.down();
};

exports.right = prompt => {
  if (!prompt.input) return prompt.alert();
  if (prompt.cursor >= prompt.input.length) return prompt.alert();
  prompt.cursor++;
  return prompt.render();
};

exports.left = prompt => {
  if (!prompt.input) return prompt.alert();
  if (prompt.cursor <= 0) return prompt.alert();
  prompt.cursor--;
  return prompt.render();
};

exports.up = prompt => {
  if (!prompt.visible) return prompt.alert();
  let len = prompt.choices.length;
  let vis = prompt.visible.length;
  let idx = prompt.index;
  if (prompt.options.scroll === false && idx === 0) {
    return prompt.alert();
  }
  if (len > vis && idx === 0) {
    return prompt.scrollUp();
  }
  prompt.index = (idx - (1 % len) + len) % len;
  if (prompt.isDisabled && prompt.isDisabled()) {
    return prompt.up();
  }
  return prompt.render();
};

exports.down = prompt => {
  if (!prompt.visible) return prompt.alert();
  let len = prompt.choices.length;
  let vis = prompt.visible.length;
  let idx = prompt.index;
  if (prompt.options.scroll === false && idx === vis - 1) {
    return prompt.alert();
  }
  if (len > vis && idx === vis - 1) {
    return prompt.scrollDown();
  }
  prompt.index = (idx + 1) % len;
  if (prompt.isDisabled && prompt.isDisabled()) {
    return prompt.down();
  }
  return prompt.render();
};

exports.number = (prompt, n) => {
  let prev = prompt.index;
  prompt.num += n;

  let number = num => {
    let i = Number(num);
    if (i > prompt.choices.length - 1) return prompt.alert();

    let focused = prompt.focused;
    let choice = prompt.choices.find(ch => i === ch.index);

    // alert when number is a disabled choice
    if (prompt.isDisabled(choice)) {
      prompt.index = prev;
      return prompt.alert();
    }

    if (!choice.enabled && prompt.selected.length >= prompt.maxSelected) {
      return prompt.alert();
    }

    if (!prompt.visible.includes(choice)) {
      let choices = utils.reorder(prompt.choices);
      let actualIdx = choices.indexOf(choice);

      if (focused.index > actualIdx) {
        let start = choices.slice(actualIdx, actualIdx + prompt.limit);
        let end = choices.filter(ch => !start.includes(ch));
        prompt.choices = start.concat(end);
      } else {
        let pos = actualIdx - prompt.limit + 1;
        prompt.choices = choices.slice(pos).concat(choices.slice(0, pos));
      }
    }

    prompt.index = prompt.choices.indexOf(choice);
    prompt.toggle(prompt.focused);
    return prompt.render();
  };

  clearTimeout(prompt.numberTimeout);

  // the following logic attempts to handle keypresses for
  // multi-digit numbers
  return new Promise(resolve => {
    let len = prompt.choices.length;
    let num = prompt.num;

    let handle = async (val = false, res) => {
      clearTimeout(prompt.numberTimeout);
      if (val === true) await number(num);
      prompt.num = '';
      resolve(res);
    };

    if (num === '0' || (num.length === 1 && Number(num + '0') > len)) {
      return handle(true);
    }

    if (Number(num) > len) {
      return handle(false).then(() => prompt.alert());
    }

    prompt.numberTimeout = setTimeout(async () => {
      await handle(true);
    }, prompt.delay);
  });
};

exports.scrollUp = (prompt, i = 0) => {
  prompt.choices = utils.scrollUp(prompt.choices);
  prompt.index = i;
  if (prompt.isDisabled && prompt.isDisabled()) {
    return prompt.up();
  }
  return prompt.render();
};

exports.scrollDown = (prompt, i) => {
  if (i === void 0) {
    i = Math.max(prompt.visible ? prompt.visible.length - 1 : 0, 0);
  }
  prompt.choices = utils.scrollDown(prompt.choices);
  prompt.index = i;
  if (prompt.isDisabled && prompt.isDisabled()) {
    return prompt.down();
  }
  return prompt.render();
};

exports.shiftUp = async prompt => {
  if (prompt.options.sort === true) {
    prompt.sorting = true;
    prompt.swap(prompt.index - 1);
    await prompt.up();
    prompt.sorting = false;
  } else {
    return prompt.scrollUp(prompt.index);
  }
};

exports.shiftDown = async prompt => {
  if (prompt.swap && prompt.options.sort === true) {
    prompt.sorting = true;
    prompt.swap(prompt.index + 1);
    await prompt.down();
    prompt.sorting = false;
  } else {
    return prompt.scrollDown(prompt.index);
  }
};

exports.pageUp = prompt => {
  // if (prompt.visible.length <= 1) return prompt.alert();
  if (prompt.limit <= 1) return prompt.alert();
  prompt.limit = Math.max(prompt.limit - 1, 0);
  prompt.index = Math.min(prompt.limit - 1, prompt.index);
  prompt._limit = prompt.limit;
  if (prompt.isDisabled && prompt.isDisabled()) {
    return prompt.up();
  }
  return prompt.render();
};

exports.pageDown = prompt => {
  // if (prompt.visible.length >= prompt.choices.length) return prompt.alert();
  if (prompt.limit >= prompt.choices.length) return prompt.alert();
  prompt.index = Math.max(0, prompt.index);
  prompt.limit = Math.min(prompt.limit + 1, prompt.choices.length);
  prompt._limit = prompt.limit;
  if (prompt.isDisabled && prompt.isDisabled()) {
    return prompt.down();
  }
  return prompt.render();
};

exports.swap = (prompt, pos) => {
  utils.swap(prompt.choices, prompt.index, pos);
};
