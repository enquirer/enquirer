'use strict';

const fs = require('fs');
const path = require('path');
const { Snippet, MultiSelect, Sort } = require('../../lib/prompts');

const fixture = fs.readFileSync(path.join(__dirname, '../_fixtures/package.json'));
const template = JSON.parse(fixture);

const fields = new MultiSelect({
  name: 'package-fields',
  message: 'What fields do you want to use in package.json?',
  choices: Object.keys(template)
});

const sorted = new Sort({
  name: 'package-sorted',
  message: 'Sort fields using <shift>+<up/down>',
  choices: () => fields.run()
});

const snippet = new Snippet({
  name: 'config-template',
  message: 'Fill out the fields in package.json',
  async template() {
    let pkg = {};
    for (let key of await sorted.run()) pkg[key] = template[key];
    return JSON.stringify(pkg, null, 2);
  }
});

snippet.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
