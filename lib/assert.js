module.exports = {
  isTruthy(value, message) {
    if (!value) { throw Error(message); }
  },
  equals(actual, expected, message) {
    if (actual !== expected) { throw Error(message); }
  }
};
