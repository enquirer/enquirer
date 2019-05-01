const { Password } = require('enquirer');

const delay = function (ms) {
  let timeout, prev;
  return function (msg, prompt) {
    return new Promise((resolve, reject) => {
      clearTimeout(timeout);
      if (prev) {
        msg = prev;
        prev = null;
        resolve(msg);
        return;
      }
      timeout = setTimeout(() => {
        prev = msg;
        prompt.render();
      }, ms);
      resolve('');
    });
  }
}

const delayMessage = delay(250);

const prompt = new Password({
  name: 'password',
  message: 'What is your password?',
  minLength: 10,
  validate(value = '') {
    let min = this.options.minLength;
    return value.length < min ? `Password must be ${min} or more chars` : true;
  },
  footer() {
    let { pointerSmall, check } = this.symbols;
    let min = this.options.minLength;
    return min - this.input.length > 0
      ? delayMessage(this.styles.danger(`${pointerSmall} password must be ${min} characters or longer`), this)
      : delayMessage(this.styles.success(`${check} password length is okay`), this);
  },
});

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);