import * as assert from 'assert';

export function has(a, b, msg) {
  if (Array.isArray(a)) {
    assert.ok(Array.isArray(b), 'expected an array');
    for (let i = 0; i < b.length; i++) has(a[i], b[i], msg);
    return;
  }

  if (typeof a === 'string') {
    assert.equal(typeof b, 'string', 'expected a string');
    assert.ok(a.includes(b), msg);
    return;
  }

  for (const key of Object.keys(b)) {
    assert.deepEqual(a[key], b[key], msg);
  }
}

export function timeout(fn, ms = 0) {
  return new Promise((resolve, reject) => {
    setTimeout(() => fn().then(resolve).catch(reject), ms);
  });
}

export const expect = (expected, msg) => actual => assert.deepEqual(actual, expected, msg);

export function nextTick(fn) {
  return new Promise((resolve, reject) => {
    process.nextTick(() => fn().then(resolve).catch(reject));
  });
}

export function immediate(fn) {
  return new Promise((resolve, reject) => {
    setImmediate(() => fn().then(resolve).catch(reject));
  });
}

export async function keypresses(prompt, chars) {
  for (const ch of chars) {
    await timeout(() => prompt.keypress(ch));
  }
}
