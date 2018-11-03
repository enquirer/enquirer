const Prompt = require('../../lib/prompts/snippet');
const prompt = new Prompt({
  name: 'username',
  message: 'Fill out the fields in package.json',
  required: true,
  fields: [
    {
      name: 'name',
      message: 'Project Name',
      validate(value) {
        return value !== 'foo';
      }
    },
    {
      name: 'author_name',
      message: 'Author Name'
    },
    {
      name: 'keywords',
      message: 'Keywords (comma separated)',
      result(value) {
        return JSON.stringify(value.split(','));
      }
    },
    {
      name: 'license',
      validate(value) {
        return value !== 'MIT';
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
