'use strict';

const fs = require('fs');
const path = require('path');
const colors = [
  { title: 'Aqua',    key: 'aqua',    value: '#00ffff' },
  { title: 'Black',   key: 'black',   value: '#000000' },
  { title: 'Blue',    key: 'blue',    value: '#0000ff' },
  { title: 'Fuchsia', key: 'fuchsia', value: '#ff00ff' },
  { title: 'Gray',    key: 'gray',    value: '#808080' },
  { title: 'Green',   key: 'green',   value: '#008000' },
  { title: 'Lime',    key: 'lime',    value: '#00ff00' },
  { title: 'Maroon',  key: 'maroon',  value: '#800000' },
  { title: 'Navy',    key: 'navy',    value: '#000080' },
  { title: 'Olive',   key: 'olive',   value: '#808000' },
  { title: 'Purple',  key: 'purple',  value: '#800080' },
  { title: 'Red',     key: 'red',     value: '#ff0000' },
  { title: 'Silver',  key: 'silver',  value: '#c0c0c0' },
  { title: 'Teal',    key: 'teal',    value: '#008080' },
  { title: 'White',   key: 'white',   value: '#ffffff' },
  { title: 'Yellow',  key: 'yellow',  value: '#ffff00' }
];

module.exports = [
  {
    type: 'autocomplete',
    name: 'actor',
    message: 'Pick your favorite actor',
    initial: 1,
    choices: [
      { key: 'Adam Sandler' },
      { key: 'Akshay Kumar' },
      { key: 'Amy Adam' },
      { key: 'Cate Blanchett' },
      { key: 'Charlize Theron' },
      { key: 'Chris Evans' },
      { key: 'Chris Hemsworth' },
      { key: 'Chris Pratt' },
      { key: 'Dwayne "The Rock" Johnson' },
      { key: 'Emma Stone' },
      { key: 'Emma Watson' },
      { key: 'Jackie Chan' },
      { key: 'Jennifer Aniston' },
      { key: 'Jennifer Lawrence' },
      { key: 'Jeremy Renner' },
      { key: 'Julia Roberts' },
      { key: 'Mark Ruffalo' },
      { key: 'Mark Wahlberg' },
      { key: 'Matt Damon' },
      { key: 'Melissa McCarthy' },
      { key: 'Mila Kunis' },
      { key: 'Robert Downey, Jr.' },
      { key: 'Ryan Gosling' },
      { key: 'Ryan Reynolds' },
      { key: 'Salman Khan' },
      { key: 'Samuel L. Jackson' },
      { key: 'Shah Rukh Khan' },
      { key: 'Tom Cruise' },
      { key: 'Tom Hanks' },
      { key: 'Vin Diesel' }
    ]
  },
  {
    type: 'confirm',
    name: 'confirmed',
    message: 'Can you confirm?',
    initial: true
  },
  {
    type: prev => prev && 'toggle',
    name: 'confirmtoggle',
    message: 'Can you confirm again?',
    inactive: 'no',
    active: 'yes'
  },
  {
    type: 'editor',
    name: 'editor',
    message: 'Fill out your bio'
  },
  {
    type: 'expand',
    name: 'expand',
    message: 'bio.md already exists, what would you like to do?',
    default: 'y',
    choices: [
      {
        key: 'y',
        name: 'Overwrite',
        value: 'overwrite'
      },
      {
        key: 'a',
        name: 'Overwrite this one and all next',
        value: 'overwrite_all'
      },
      {
        key: 'd',
        name: 'Show diff',
        value: 'diff'
      },
      {
        key: 'x',
        name: 'Abort',
        value: 'abort'
      }
    ]
  },
  {
    type: 'form',
    name: 'config',
    message: 'Please fill in the following information:',
    hint: '',
    choices:   [
     {
        key: 'firstname',
        message: 'First Name:',
        hint: 'Jon',
      },
      {
        key: 'lastname',
        message: 'Last Name:',
        hint: 'Schlinkert',
      },
      {
        key: 'username',
        message: 'GitHub username:',
      },
      {
        key: 'email',
        message: 'Email:'
      }
    ]
  },
  // {
  //   type: 'grid',
  //   name: 'grid',
  //   message: 'Do something with the grid',
  //   choices: [1, 2, 3, 4, 5, 6, 7, 8, 9].map(String)
  // },
  {
    type: 'input',
    name: 'twitter',
    message: `What's your twitter handle?`,
    initial: 'Brian',
    format: val => `@${val.toLowerCase()}`,
    validate: answer => true
  },
  {
    type: 'invisible',
    name: 'hidden',
    message: 'What is your secret?'
  },
  {
    type: 'list',
    name: 'keywords',
    message: 'Enter keywords'
  },
  {
    type: 'multiselect',
    name: 'multicolor',
    message: 'Pick colors',
    choices: colors.map(color => ({ ...color }))
  },
  {
    type: 'number',
    name: 'age',
    message: 'How old are you?',
    float: true
  },
  {
    type: 'password',
    name: 'password',
    message: 'What is your password?'
  },
  {
    type: 'radio',
    name: 'radio',
    message: 'Pick a color',
    initial: 3,
    limit: 8,
    choices: colors.map(color => ({ ...color }))
  },
  {
    type: 'select',
    name: 'color',
    message: 'Pick a color',
    choices: colors.map(color => ({ ...color }))
  },
  {
    type: 'snippet',
    name: 'snippet',
    message: 'Fill in package.json',
    values: (answers) => {
      if (answers.config) {
        return { owner: answers.config.username };
      }
      return {};
    },
    template() {
      return fs.readFileSync(path.join(__dirname, 'fixtures/package.tmpl'), 'utf8');
    }
  }
];
