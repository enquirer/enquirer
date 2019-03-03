'use strict';

exports.keypress = (prompt, input, key) => {
  let prev = prompt.state.prevKeypress;
  prompt.state.prevKeypress = key;
  if (prompt.options.multiline === true && key.name === 'return') {
    if (!prev || prev.name !== 'return') {
      return prompt.append('\n', key);
    }
  }
};

exports.reset = prompt => {
  prompt.state.input = prompt.state.value = '';
  prompt.state.cursor = 0;
  return prompt.render();
};

exports.append = (prompt, char) => {
  let { cursor, input } = prompt.state;
  let str = String(char);
  prompt.state.input = input.slice(0, cursor) + str + input.slice(cursor);
  prompt.state.cursor += str.length;
  return prompt.render();
};

exports.delete = prompt => {
  let { cursor, input } = prompt.state;
  if (cursor <= 0) return prompt.alert();
  prompt.state.input = input.slice(0, cursor - 1) + input.slice(cursor);
  prompt.state.cursor--;
  return prompt.render();
};

exports.deleteForward = prompt => {
  let { cursor, input } = prompt.state;
  if (input[cursor] === void 0) return prompt.alert();
  prompt.state.input = input.slice(0, cursor) + input.slice(cursor + 1);
  return prompt.render();
};

exports.cutForward = prompt => {
  let { cursor, input } = prompt.state;
  if (input[cursor] === void 0) return prompt.alert();
  prompt.state.clipboard.push(input.slice(cursor));
  prompt.state.input = input.slice(0, cursor);
  return prompt.render();
};

exports.cutLeft = prompt => {
  let { cursor, input } = prompt.state;
  if (cursor === 0) return prompt.alert();
  let before = input.slice(0, cursor);
  let after = input.slice(cursor);
  let words = before.split(' ');
  prompt.state.clipboard.push(words.pop());
  prompt.state.input = words.join(' ');
  prompt.state.cursor = prompt.state.input.length;
  prompt.state.input += after;
  return prompt.render();
};

exports.paste = prompt => {
  let clipboard = prompt.state.clipboard;
  if (!clipboard.length) return prompt.alert();
  return exports.append(prompt, clipboard.pop());
};

exports.toggleCursor = prompt => {
  let state = prompt.state;
  if (state.prevCursor) {
    state.cursor = state.prevCursor;
    state.prevCursor = 0;
  } else {
    state.prevCursor = state.cursor;
    state.cursor = 0;
  }
};

exports.first = prompt => {
  if (prompt.state.cursor === 0) return prompt.alert();
  prompt.state.cursor = 0;
  return prompt.render();
};

exports.last = prompt => {
  let pos = prompt.state.input.length - 1;
  if (prompt.state.cursor === pos) return prompt.alert();
  prompt.state.cursor = pos;
  return prompt.render();
};

exports.next = async prompt => {
  let state = prompt.state;
  let initial = state.initial ? await prompt.resolve(state.initial, state) : '';
  if (!initial || !initial.startsWith(state.input)) return prompt.alert();
  state.input = initial;
  state.cursor = initial.length;
  return prompt.render();
};

exports.prev = prompt => {
  if (!prompt.state.input) return prompt.alert();
  return exports.reset(prompt);
};

exports.backward = prompt => exports.left(prompt);
exports.forward = prompt => exports.right(prompt);

exports.right = prompt => {
  let { cursor, input } = prompt.state;
  if (cursor >= input.length) return prompt.alert();
  prompt.state.cursor++;
  return prompt.render();
};

exports.left = prompt => {
  if (prompt.state.cursor <= 0) return prompt.alert();
  prompt.state.cursor--;
  return prompt.render();
};
