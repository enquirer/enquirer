'use strict';

const FormPrompt = require('../prompts/form');

const defaultVerify = () => {
  throw new Error('expected prompt to have a custom verify method');
};

const factory = (verify = defaultVerify) => {

  class AuthPrompt extends FormPrompt {
    constructor(options) {
      super(options);
    }

    async submit() {
      this.value = await verify.call(this, this.values, this.state);
      super.base.submit.call(this);
    }

    static create(verify) {
      return factory(verify);
    }
  }

  return AuthPrompt;
};

module.exports = factory();
