const Store = require('data-store');
const { Input } = require('../..');

const prompt = new Input({
  name: 'username',
  message: 'GitHub username?',
  history: {
    store: new Store({ path: `${__dirname}/username.json` }),
    autosave: true
  }
});

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
