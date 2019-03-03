'use strict';

exports.next = prompt => {
  if (prompt.input && prompt.input !== prompt.initial) return prompt.alert();
  if (!prompt.isValue(prompt.initial)) return prompt.alert();
  prompt.input = prompt.initial;
  prompt.cursor = String(prompt.initial).length;
  return prompt.render();
};

exports.up = (prompt, number) => {
  let step = number || prompt.minor;
  let num = prompt.toNumber(prompt.input);
  if (num > prompt.max + step) return prompt.alert();
  prompt.input = `${num + step}`;
  return prompt.render();
};

exports.down = (prompt, number) => {
  let step = number || prompt.minor;
  let num = prompt.toNumber(prompt.input);
  if (num < prompt.min - step) return prompt.alert();
  prompt.input = `${num - step}`;
  return prompt.render();
};

exports.shiftDown = prompt => prompt.down(prompt.major);
exports.shiftUp = prompt => prompt.up(prompt.major);
