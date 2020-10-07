import createFormPrompt from '../prompts/form.js';

const defaultAuthenticate = () => {
  throw new Error('expected prompt to have a custom authenticate method');
};

export default function createAuthPrompt(platformShims, authenticate = defaultAuthenticate) {
  const FormPrompt = createFormPrompt(platformShims);

  class AuthPrompt extends FormPrompt {
    constructor(options) {
      super(options);
    }

    async submit() {
      this.value = await authenticate.call(this, this.values, this.state);
      super.base.submit.call(this);
    }
  }

  return AuthPrompt;
}
