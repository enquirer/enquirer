/**
 * `autocomplete` type prompt
 * This is entirely based on https://www.npmjs.com/package/inquirer-autocomplete-prompt
 * Copyright (c) 2015, Martin Hansen <martin@martinhansen.no>
 */

var util = require('util');
var log = require('log-utils');
var figures = require('figures');
var Paginator = require('terminal-paginator');
var BasePrompt = require('prompt-base');
var Choices = require('prompt-choices');
var utils = require('readline-utils');

/**
 * Create a new autocomplete `Prompt`
 */

function Prompt() {
  BasePrompt.apply(this, arguments);
  if (!this.question.source) {
    throw new TypeError('expected source to be defined');
  }

  this.currentChoices = [];
  this.firstRender = true;
  this.selected = 0;

  // Make sure no default is set (so it won't be printed)
  this.question.default = undefined;
  this.paginator = new Paginator();
}

/**
 * Inherit `BasePrompt`
 */

util.inherits(Prompt, BasePrompt);

/**
 * Start the prompt session
 * @param  {Function} `cb` Callback when prompt is finished
 * @return {Object} Returns the instance for chaining
 */

Prompt.prototype.ask = function(cb) {
  this.callback = cb;
  if (Array.isArray(this.rl.history)) {
    this.rl.history = [];
  }

  this.ui.on('line', this.onSubmit.bind(this));
  this.ui.on('down', this.createChoices.bind(this, ''));
  this.ui.on('keypress', this.onKeypress.bind(this));

  // initialize search
  this.search();
  return this;
};

/**
 * Render the prompt to screen
 * @return {Prompt} self
 */

Prompt.prototype.render = function() {
  var message = this.message;
  var bottomContent = '';
  if (this.firstRender) {
    this.firstRender = false;
    message += log.dim('(Use arrow keys or type to search)');
  }
  // Render choices or answer depending on the state
  if (this.status === 'answered') {
    message += log.cyan(this.answer);
  } else if (this.searching) {
    message += this.rl.line;
    bottomContent += '  ' + log.dim('Searching...');
  } else if (this.currentChoices.length) {
    var choicesStr = listRender(this.currentChoices, this.selected);
    message += this.rl.line;
    bottomContent += this.paginator.paginate(choicesStr, this.selected);
  } else {
    message += this.rl.line;
    bottomContent += '  ' + log.yellow('No results...');
  }
  this.ui.render(message, bottomContent);
};

/**
 * When user press `enter` key
 */

Prompt.prototype.createChoices = function(line) {
  if (this.currentChoices.length <= this.selected) {
    this.rl.write(line);
    this.search(line);
    return true;
  }
};

Prompt.prototype.onSubmit = function(line) {
  if (this.createChoices(line)) return;
  var choice = this.currentChoices.getChoice(this.selected);
  this.submitAnswer(choice.value);
};

Prompt.prototype.search = function(searchTerm) {
  this.selected = 0;
  var self = this;

  // only render searching state after first time
  if (this.searchedOnce) {
    this.searching = true;
    this.currentChoices = new Choices([]);
    this.render(); // now render current searching state
  } else {
    this.searchedOnce = true;
  }

  this.lastSearchTerm = searchTerm;
  var thisPromise = this.question.source(this.answers, searchTerm);

  // store this promise for check in the callback
  this.lastPromise = thisPromise;

  return thisPromise.then(function inner(choices) {
    // if another search is triggered before the current search finishes, don't set results
    if (thisPromise !== self.lastPromise) return;

    choices = new Choices(choices.filter(function(choice) {
      return choice.type !== 'separator';
    }));

    self.currentChoices = choices;
    self.searching = false;
    self.render();
  });
};

/**
 * Coerce selection to fit within the min-max accepted range
 */

Prompt.prototype.coerceToRange = function() {
  var selectedIndex = Math.min(this.selected, this.currentChoices.length);
  this.selected = Math.max(selectedIndex, 0);
};

/**
 * When user types
 */

Prompt.prototype.onKeypress = function(e) {
  var keypress = e.key && e.key.name;
  var len = this.currentChoices.length;

  if (keypress === 'down') {
    this.selected = (this.selected < len - 1) ? this.selected + 1 : 0;
    this.coerceToRange();
    this.render();
    utils.up(this.rl, 2);
    return;
  }

  if (keypress === 'up') {
    this.selected = (this.selected > 0) ? this.selected - 1 : len - 1;
    this.coerceToRange();
    this.render();
    return;
  }

  // render input
  this.render();

  // Only search if input has actually changed
  if (this.lastSearchTerm !== this.rl.line) {
    // trigger new search
    this.search(this.rl.line);
  }
};

/**
 * Function for rendering list choices
 * @param  {Number} pointer Position of the pointer
 * @return {String} Rendered content
 */

function listRender(choices, pointer) {
  var separatorOffset = 0;
  var output = '';

  choices.forEach(function(choice, i) {
    if (choice.type === 'separator') {
      separatorOffset++;
      output += '  ' + choice + '\n';
      return;
    }

    var isSelected = (i - separatorOffset === pointer);
    var line = (isSelected ? figures.pointer + ' ' : '  ') + choice.name;

    if (isSelected) {
      line = log.cyan(line);
    }
    output += line + ' \n';
  });

  return output.replace(/\n$/, '');
}

/**
 * Module exports
 */

module.exports = Prompt;
