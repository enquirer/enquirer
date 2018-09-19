'use strict';

const utils = require('./utils');

module.exports = {
  /**
   * Global options supported by all prompts
   */

  // this.name = this.options.name || '';
  // this.styles = styles(this.options.styles);
  // this.message = this.options.message || (this.name + '?');
  // this.initial = this.options.initial;
  // this.output = this.options.output || process.stdout;
  // this.input = this.options.input || process.stdin;

  enquirer: {

  },

  prompt: {
    type: {
      type: ['string'],
      required: false,
      description: 'Prompt type'
    },
    name: {
      type: ['string'],
      description: 'Prompt name',
      default(val, opts) {
        return val || opts.message || opts.title;
      }
    },
    message: {
      type: ['string'],
      description: 'Prompt message',
      default(val, opts) {
        return val || opts.name || opts.title || opts.value;
      }
    },
    title: {
      type: ['string'],
      description: 'Alias for message',
      deprecated: true
    },

    initial: {
      type: ['string'],
      description: 'Initial value'
    },
    default: {
      type: ['string'],
      description: 'Default value'
    },
    value: {
      type: ['string'],
      description: 'Value'
    },

    hint: {
      type: ['function', 'async', 'string']
    },

    input: {
      type: ['stream'],
      description: 'stdin stream'
    },
    output: {
      type: ['stream'],
      description: 'stdout stream'
    },

    style: { type: ['string'] },
    show: { type: ['string'] },
    header: { type: ['string', 'function'] },
    prefix: { type: ['string', 'function'] },
    separator: { type: ['string', 'function'] },
    indicator: { type: ['string', 'function'] },
    footer: { type: ['string', 'function'] },

    styles: {
      type: ['object'],
      description: 'Prompt styles'
    },

    when: {
      type: ['function', 'async']
    },
    validate: {
      type: ['function', 'async']
    },
    format: {
      type: ['function', 'async']
    },

    onSubmit: {
      type: ['function', 'async']
    },
    onState: {
      type: ['function', 'async']
    },
    onCancel: {
      type: ['function', 'async']
    }
  },

  /**
   * Choice objects
   */

  choice: {

  },

  /**
   * Prompt types
   */

  array: {
    autofocus: {
      type: ['string', 'number'],
      description: ''
    },
    initial: {
      type: ['array', 'string', 'number'],
      description: 'Initial value'
    },
  },
  boolean: {

  },
  date: {

  },
  number: {

  },
  string: {

  }
};
