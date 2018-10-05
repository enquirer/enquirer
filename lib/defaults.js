module.exports = {
  stdout: typeof process !== 'undefined' && process.stdout,
  stdin: typeof process !== 'undefined' && process.stdin,
  validate: () => true,
  skip: () => true
};
