'use strict';

const fs = require('fs');
const path = require('path');
const colors = [
  { message: 'Aqua',    name: 'aqua',    value: '#00ffff' },
  { message: 'Black',   name: 'black',   value: '#000000' },
  { message: 'Blue',    name: 'blue',    value: '#0000ff' },
  { message: 'Fuchsia', name: 'fuchsia', value: '#ff00ff' },
  { message: 'Gray',    name: 'gray',    value: '#808080' },
  { message: 'Green',   name: 'green',   value: '#008000' },
  { message: 'Lime',    name: 'lime',    value: '#00ff00' },
  { message: 'Maroon',  name: 'maroon',  value: '#800000' },
  { message: 'Navy',    name: 'navy',    value: '#000080' },
  { message: 'Olive',   name: 'olive',   value: '#808000' },
  { message: 'Purple',  name: 'purple',  value: '#800080' },
  { message: 'Red',     name: 'red',     value: '#ff0000' },
  { message: 'Silver',  name: 'silver',  value: '#c0c0c0' },
  { message: 'Teal',    name: 'teal',    value: '#008080' },
  { message: 'White',   name: 'white',   value: '#ffffff' },
  { message: 'Yellow',  name: 'yellow',  value: '#ffff00' }
];

module.exports = [
  {
    type: 'autocomplete',
    name: 'actor',
    message: 'Pick your favorite actor',
    initial: 1,
    choices: [
      { name: 'Adam Sandler' },
      { name: 'Akshay Kumar' },
      { name: 'Amy Adam' },
      { name: 'Cate Blanchett' },
      { name: 'Charlize Theron' },
      { name: 'Chris Evans' },
      { name: 'Chris Hemsworth' },
      { name: 'Chris Pratt' },
      { name: 'Dwayne "The Rock" Johnson' },
      { name: 'Emma Stone' },
      { name: 'Emma Watson' },
      { name: 'Jackie Chan' },
      { name: 'Jennifer Aniston' },
      { name: 'Jennifer Lawrence' },
      { name: 'Jeremy Renner' },
      { name: 'Julia Roberts' },
      { name: 'Mark Ruffalo' },
      { name: 'Mark Wahlberg' },
      { name: 'Matt Damon' },
      { name: 'Melissa McCarthy' },
      { name: 'Mila Kunis' },
      { name: 'Robert Downey, Jr.' },
      { name: 'Ryan Gosling' },
      { name: 'Ryan Reynolds' },
      { name: 'Salman Khan' },
      { name: 'Samuel L. Jackson' },
      { name: 'Shah Rukh Khan' },
      { name: 'Tom Cruise' },
      { name: 'Tom Hanks' },
      { name: 'Vin Diesel' }
    ],
    suggest(input, choices) {
      return choices.filter(choice => choice.message.toLowerCase().includes(input.toLowerCase()));
    }
  },
  {
    type: 'confirm',
    name: 'confirmed',
    message: 'Can you confirm?',
    initial: true
  },
  {
    type: 'text',
    name: 'twitter',
    message: `What's your twitter handle?`,
    initial: 'Brian',
    validate: () => true
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
    type: 'select',
    name: 'color',
    message: 'Pick a color',
    choices: colors.map(color => ({ ...color }))
  }
];
