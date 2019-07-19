'use strict';

const AuthPrompt = require('../types/auth');

function defaultVerify(value, state) {
  if (value.username === this.options.username && value.password === this.options.password) {
    return true;
  }
  return false;
}

const factory = (verify = defaultVerify) => {
  const choices = [
    { name: 'username', message: 'username' },
    {
      name: 'password',
      message: 'password',
      format(input) {
        if (this.options.showPassword) {
          return input;
        }
        let color = this.state.submitted ? this.styles.primary : this.styles.muted;
        return color(this.symbols.asterisk.repeat(input.length));
      }
    }
  ];

  class BasicAuthPrompt extends AuthPrompt.create(verify) {
    constructor(options) {
      super({ ...options, choices });
    }

    static create(verify) {
      return factory(verify);
    }
  }

  return BasicAuthPrompt;
};

module.exports = factory();
