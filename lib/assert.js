export function isTruthy(value, message) {
  if (!value) { throw Error(message); }
}

export function equals(actual, expected, message) {
  if (actual !== expected) { throw Error(message); }
}
