'use strict';

const colors = require('ansi-colors');
const { Snippet } = require('enquirer');
const prompt = new Snippet({
  name: 'username',
  message: 'Fill out the fields in package.json',
  fields: [
    {
      name: 'keywords',
      message: 'Keywords (comma separated)',
      format(value, state, item, index) {
        if (item.placeholder === true) {
          if (index === state.index) {
            value = state.styles.complement.underline(colors.unstyle(value));
          }
          return value + ' ' + colors.dim('// enter comma-separated values');
        }
        return '[' + colors.unstyle(value).split(',').map(v => {
          let res = state.styles.complement(v);
          if (index === state.index) {
            res = colors.underline(res);
          }
          return res;
        }).join(', ') + ']';
      },
      result(value) {
        return JSON.stringify(value.split(','));
      }
    }
  ],
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
`
});

prompt.run()
  .then(answer => console.log('Answer:', answer.result))
  .catch(console.error);
