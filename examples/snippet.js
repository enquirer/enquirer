const Prompt = require('../recipes/snippet');
const prompt = new Prompt({
  name: 'username',
  message: 'What is your GitHub username?',
  initial: {
    name: 'awesome-lib'
  },
  template: `{
  "name": "{{name}}",
  "description": "{{description}}",
  "version": "{{version}}",
  "homepage": "{{homepage}}",
  "author": "{{author_name}} ({{author_url}})",
  "repository": "{{owner}}/{{name}}",
  "bugs": {
    "url": "https://github.com/{{owner}}/{{name}}/issues"
  },
  "engines": {
    "node": ">=4"
  },
  "license": "{{license}}",
  "scripts": {
    "test": "mocha"
  },
  "keywords": []
}
`
});

prompt.run()
  // .then(answer => console.log('Answer:', answer))
  .catch(console.error);
