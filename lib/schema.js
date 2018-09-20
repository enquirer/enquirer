'use strict';

const styles = require('./style/styles');

/**
 * Options schema
 */

module.exports = {

  /**
   * Enquirer-specific options
   */

  enquirer: {
    config: {},
    before() {},
    after: [],
    properties: {}
  },

  /**
   * Options for all prompts
   */

  prompt: {
    config: {},
    before() {},
    after: [],
    properties: {
      type: {
        type: ['string'],
        description: 'Prompt type'
      },
      name: {
        type: ['string'],
        description: 'Prompt name',
        resolve(val, opts) {
          return val || opts.message || opts.key || opts.value;
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

      input: {
        type: ['stream'],
        description: 'stdin stream',
        default: process.stdin
      },
      output: {
        type: ['stream'],
        description: 'stdout stream',
        default: process.stdout
      },

      style: { type: ['string'] },
      show: {
        type: ['boolean'],
        default: true
      },
      header: { type: ['function', 'async', 'string'] },
      prefix: { type: ['function', 'async', 'string'] },
      indicator: { type: ['function', 'async', 'string'] },
      message: {
        type: ['string'],
        description: 'Prompt message',
        resolve(value, options) {
          return value || options.name || options.title;
        }
      },
      separator: { type: ['function', 'async', 'string'] },
      hint: { type: ['function', 'async', 'string'] },
      footer: { type: ['function', 'async', 'string'] },

      styles: {
        type: ['object'],
        description: 'Prompt styles',
        resolve(value) {
          return styles(value);
        }
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
    }
  },

  /**
   * Array prompts
   */

  array: {
    config: {},
    before() {},
    after: [],
    properties: {
      autofocus: {
        type: ['string', 'number'],
        description: ''
      },
      initial: {
        type: ['array', 'string', 'number'],
        description: 'Initial value'
      },
      selected: {
        type: ['array', 'string', 'number'],
        description: 'Initial value'
      },
      choices: {
        type: ['array<string|object>'],
        description: 'Array of choices'
      }
    }
  },

  /**
   * Boolean prompts
   */

  boolean: {
    config: {},
    before() {},
    after: [],
    properties: {}
  },

  /**
   * Date prompts
   */

  date: {
    config: {},
    before() {},
    after: [],
    properties: {}
  },

  /**
   * Number prompts
   */

  number: {
    config: {},
    before() {},
    after: [],
    properties: {}
  },

  /**
   * String prompts
   */

  string: {
    config: {},
    before() {},
    after: [],
    properties: {}
  },

  /**
   * Choice objects
   */

  choice: {
    config: { merge: false },
    before(schema) {
      const after = choices => {
        let autofocus = choices.filter(ch => ch.autofocus);
        if (autofocus.length > 1) {
          throw new Error('autofocus may only be enabled on one choice');
        }
      };
      schema.array.after.push(after);
    },
    after: [],
    properties: {
      type: {
        type: ['string']
      },
      name: {
        type: ['string'],
        required: true
      },
      message: {
        type: ['string'],
        default: '',
        resolve(value, options) {
          return value || options.name || options.title;
        }
      },
      autofocus: {
        type: ['string']
      },
      value: {
        type: [],
        default: ''
      },
      disabled: {
        type: ['boolean'],
        default: false
      },
      enabled: {
        type: [],
        default: false
      },

      indicator: {
        type: ['string'],
        default: ''
      },
      hint: {
        type: ['string'],
        default: ''
      },
      error: {
        type: ['string'],
        default: ''
      }
    }
  }
};
