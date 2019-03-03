'use strict';

const utils = require('../utils');

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
  return prompt.render();
};

exports.last = prompt => {
  prompt.index = prompt.visible.length - 1;
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
    return exports.scrollUp(prompt, prompt.index);
  }
};

exports.shiftDown = async prompt => {
  if (prompt.swap && prompt.options.sort === true) {
    prompt.sorting = true;
    prompt.swap(prompt.index + 1);
    await prompt.down();
    prompt.sorting = false;
  } else {
    return exports.scrollDown(prompt, prompt.index);
  }
};

exports.pageUp = prompt => {
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
  if (prompt.limit >= prompt.choices.length) return prompt.alert();
  prompt.index = Math.max(0, prompt.index);
  prompt.limit = Math.min(prompt.limit + 1, prompt.choices.length);
  prompt._limit = prompt.limit;
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

    let handle = async(val = false, res) => {
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

    prompt.numberTimeout = setTimeout(async() => {
      await handle(true);
    }, prompt.delay);
  });
};
