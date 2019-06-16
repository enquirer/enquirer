'use strict';

exports.reset = prompt => {
  prompt.shift.reset();
  prompt.input = prompt.state.value = '';
  prompt.cursor = 0;
  return prompt.render();
};

exports.append = (prompt, val) => {
  let { cursor, input } = prompt.state;
  let { start, end } = prompt.shift;
  let str = String(val);
  if (prompt.shift.first !== null) {
    prompt.input = input.slice(0, start) + str + input.slice(end);
    prompt.cursor = end;
  } else {
    prompt.input = input.slice(0, cursor) + str + input.slice(cursor);
    prompt.moveCursor(str.length);
  }
  return prompt.render();
};

exports.delete = prompt => {
  let { cursor, input } = prompt;
  let { start, end } = prompt.shift;
  if (cursor <= 0) return prompt.alert();
  if (prompt.shift.first !== null) {
    prompt.input = input.slice(0, start) + input.slice(end);
    prompt.cursor = start;
  } else {
    prompt.input = input.slice(0, cursor - 1) + input.slice(cursor);
    prompt.moveCursor(-1);
  }
  return prompt.render();
};

exports.deleteForward = prompt => {
  let { cursor, input } = prompt;
  if (input[cursor] === void 0) return prompt.alert();
  prompt.input = input.slice(0, cursor) + input.slice(cursor + 1);
  return prompt.render();
};

exports.cut = prompt => {
  let { start, end } = prompt.shift;
  if (!end) return prompt.alert();
  prompt.shift.reset();
  prompt.state.clipboard.push(prompt.input.slice(start, end));
  prompt.input = prompt.input.slice(0, start) + prompt.input.slice(end);
  prompt.cursor = start;
  return prompt.render();
};

exports.cutForward = prompt => {
  let { cursor, input } = prompt;
  if (input.length <= cursor) return prompt.alert();
  prompt.state.clipboard.push(input.slice(cursor));
  prompt.input = input.slice(0, cursor);
  return prompt.render();
};

exports.cutLeft = prompt => {
  let { cursor, input } = prompt;
  if (cursor === 0) return prompt.alert();
  let before = input.slice(0, cursor);
  let after = input.slice(cursor);
  let words = before.split(' ');
  prompt.state.clipboard.push(words.pop());
  prompt.input = words.join(' ');
  prompt.cursor = prompt.input.length;
  prompt.input += after;
  return prompt.render();
};

exports.paste = prompt => {
  let clipboard = prompt.state.clipboard;
  if (!clipboard.length) return prompt.alert();
  return prompt.append(clipboard.pop());
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
  return prompt.render();
};

exports.first = prompt => {
  if (prompt.cursor === 0) return prompt.alert();
  prompt.cursor = 0;
  return prompt.render();
};

exports.last = prompt => {
  let pos = prompt.input.length - 1;
  if (prompt.cursor === pos) return prompt.alert();
  prompt.cursor = pos;
  return prompt.render();
};

exports.next = async prompt => {
  let state = prompt.state;
  let initial = prompt.initial != null ? await prompt.resolve(state.initial, state) : '';
  if (!initial || !initial.startsWith(state.input)) return prompt.alert();
  state.input = initial;
  state.cursor = initial.length;
  return prompt.render();
};

exports.prev = prompt => {
  if (!prompt.input) return prompt.alert();
  return exports.reset(prompt);
};

exports.backward = prompt => exports.left(prompt);
exports.forward = prompt => exports.right(prompt);

exports.right = prompt => {
  let { cursor, input } = prompt;
  if (cursor >= input.length) return prompt.alert();
  prompt.cursor++;
  return prompt.render();
};

exports.left = prompt => {
  if (prompt.cursor <= 0) return prompt.alert();
  prompt.cursor--;
  return prompt.render();
};

exports.shiftLeft = prompt => {
  if (prompt.cursor <= 0) return prompt.alert();
  if (prompt.shift.end === prompt.shift.start) prompt.shift.reset();
  if (!prompt.shift.end) {
    prompt.shift.end = prompt.cursor;
    prompt.shift.start = prompt.cursor - 1;
    prompt.shift.first = 'end';
  } else if (prompt.shift.first === 'start') {
    prompt.shift.end--;
  } else {
    prompt.shift.start--;
  }
  return prompt.left();
};

exports.shiftRight = prompt => {
  if (prompt.cursor >= prompt.input.length) return prompt.alert();
  if (prompt.shift.end === prompt.shift.start) prompt.shift.reset();
  if (!prompt.shift.end) {
    prompt.shift.end = prompt.cursor + 1;
    prompt.shift.start = prompt.cursor;
    prompt.shift.first = 'start';
  } else if (prompt.shift.first === 'start') {
    prompt.shift.end++;
  } else {
    prompt.shift.start++;
  }
  return prompt.right();
};
