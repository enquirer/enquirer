const Prompt = require('../../lib/prompts/snippet');
const prompt = new Prompt({
  name: 'username',
  message: 'Fill out the fields in package.json',
  regex: /<%=\s*([^% ]+)([^%]*)\s*%>/g,
  defaults: {
    name: 'awesome-lib',
    version: '0.1.0',
    license: 'MIT'
  },
  required: ['name', 'version', 'description'],
  initial: 'version',
  template: `{
  "name": "<%= name %>",
  "description": "<%= description %>",
  "version": "<%= version %>",
  "homepage": "https://github.com/<%= author.username %>/<%= name %>",
  "author": "<%= author.name %> (https://github.com/<%= author.username %>)",
  "repository": "<%= author.username %>/<%= name %>",
  "bugs": {
    "url": "https://github.com/<%= author.username %>/<%= name %>/issues"
  },
  "engines": {
    "node": ">=4"
  },
  "license": "<%= license %>",
  "scripts": {
    "test": "mocha"
  },
  "keywords": []
}
`
});

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
