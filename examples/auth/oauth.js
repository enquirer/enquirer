const AuthPrompt = require('../../lib/types/auth');
const express = require('express');
const open = require('open');
const axios = require('axios');

const choices = [{ name: 'oauth', message: 'Github OAuth login' }];

class OAuthServer {
  constructor(options) {
    this.options = options;
    this.prompt = this.options.prompt;
    this.app = express();
    this.app.get('/', (req, res) => {
      const code = req.query.code;
      axios
        .post(
          `https://github.com/login/oauth/access_token?client_secret=${
            this.options.client_secret
          }&client_id=${this.options.client_id}&code=${code}`,
          {},
          {
            headers: {
              Accept: 'application/json'
            }
          }
        )
        .then(response => {
          const accessToken = response.data.access_token;
          this.token = accessToken;
          res.send('Enquirer: Github OAuth Server is up');
          this.prompt.submit();
        })
        .catch(e => console.log('axios error', e));
    });
    this.token = null;
  }

  start() {
    return new Promise((resolve, reject) => {
      this.server = this.app.listen(this.options.port, err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  }

  stop() {
    this.server.close();
  }
}

async function verify() {
  await this.server.stop();
  return this.server.token; // token received from Github
}

class OAuth extends AuthPrompt.create(verify) {
  constructor(options = {}) {
    super({ ...options, choices });
    this.value = options.initial || 0;
    this.cursorHide();
    this.server = new OAuthServer({
      ...this.options,
      prompt: this,
      port: 9000
    });
  }

  async initialize() {
    this.url = `https://github.com/login/oauth/authorize?client_id=${this.options.client_id}`;
    await super.initialize();
    await this.server.start();
    await open(this.url);
  }

  render() {
    this.clear();
    this.write(`\nOpen this URL in browser if it doesn't open automatically:\n${this.url}`);
  }
}

/*
 * Please read the Github OAuth documentation (https://developer.github.com/apps/building-oauth-apps/authorizing-oauth-apps/)
 * to register your own app and use the client_id and client_secret accordingly.
 * The given ID and secret are for this example prompt only.
 *
 * Set Authorization callback URL to http://localhost:9000
 * while registering a new OAuth application in Github
 */
const prompt = new OAuth({
  name: 'oauth',
  client_id: 'a3f315d8990032f30936',
  client_secret: '2785a2397550f17a6bc95bdddbea7d4c7ba2b662'
});

prompt
  .run()
  .then(token => console.log(`\nYou've successfully logged in using Github.\nToken: ${token}`))
  .catch(console.error);
