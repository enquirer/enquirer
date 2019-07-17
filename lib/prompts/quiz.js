'use strict';

const SelectPrompt = require('./select');

class Quiz extends SelectPrompt {
  constructor(options) {
    super(options);
    if (!this.options.correctChoice) {
      throw new Error('Please specify the index of the correct answer from the list of choices');
    }

    if (this.options.choices && this.options.choices.length < 2) {
      throw new Error('Please give at least two choices to the user');
    }

    if (
      typeof this.options.correctChoice !== 'number' ||
      this.options.correctChoice > this.options.choices.length ||
      this.options.correctChoice < 0
    ) {
      throw new Error('Correct is invalid');
    }
  }

  check(state) {
    if (state.index === this.options.correctChoice) {
      return true;
    }
    return false;
  }

  result() {
    return {
      selected: this.check(this.state),
      correct: this.options.choices[this.options.correctChoice].value
    };
  }
}

module.exports = Quiz;
