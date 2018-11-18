'use strict';

const colors = require('ansi-colors');
const semver = require('semver');
const { Snippet } = require('enquirer');
const prompt = new Snippet({
  name: 'username',
  message: 'Fill out the fields in package.json',
  defaults: {
    name: 'awesome-lib',
    version: '0.1.0',
    license: 'MIT'
  },
  required: 'description',
  initial: 'version',
  fields: [
    {
      name: 'version',
      validate(value, state, field) {
        if (field && field.name === 'version' && !semver.valid(value)) {
          return colors.red('expected a valid semver value');
        }
        return true;
      }
    }
  ],
  template: `{
  "name": "{{name}}",
  "description": "{{description}}",
  "version": "{{version}}",
  "homepage": "https://github.com/{{username}}/{{name}}",
  "author": "{{author_name}} (https://github.com/{{username}})",
  "repository": "{{username}}/{{name}}",
  "bugs": {
    "url": "https://github.com/{{username}}/{{name}}/issues"
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
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
