'use strict';

const { Snippet } = require('enquirer');

const prompt = new Snippet({
  name: 'username',
  message: 'Fill out the fields in package.json',
  template: `{
  "name": "\${name}",
  "description": "\${description:This is a great project}",
  "version": "\${version}",
  "homepage": "https://github.com/\${username}/\${name}",
  "author": "\${author_name} (https://github.com/\${username})",
  "repository": "\${username}/\${name}",
  "bugs": {
    "url": "https://github.com/\${username}/\${name}/issues"
  },
  "engines": {
    "node": ">=4"
  },
  "license": "\${license:MIT}",
  "scripts": {
    "test": "mocha"
  },
  "keywords": \${keywords}
}
`,
  fields: [
    // {
    //   name: 'version',
    //   validate(value, state, item, index) {
    //     if (item && item.name === 'version' && !semver.valid(value)) {
    //       return colors.red('version should be a valid semver value');
    //     }
    //     return true;
    //   },
    // },
    {
      name: 'name',
      validate(value) {
        return value !== '' && value !== 'Jon';
      }
    },
    {
      name: 'username',
      validate(value) {
        return value !== '' && value !== 'jon';
      }
    }
    // {
    //   name: 'license',
    //   validate(value) {
    //     return value !== 'MIT';
    //   }
    // }
  ]
});

prompt.run()
  .then(answer => console.log('Answer:', answer.result))
  .catch(console.error);
