import createAuthPrompt from '../types/auth.js';

function defaultAuthenticate(value) {
  return value.username === this.options.username && value.password === this.options.password;
}

export default function createBasicAuthPrompt(platformShims, authenticate = defaultAuthenticate) {
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

  const AuthPrompt = createAuthPrompt(platformShims, authenticate);

  class BasicAuthPrompt extends AuthPrompt {
    constructor(options) {
      super({ ...options, choices });
    }
  }

  return BasicAuthPrompt;
}
