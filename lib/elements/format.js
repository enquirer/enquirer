'use strict';

module.exports = (prompt, superFormat) => {

  const format = {
    default: () => prompt.input,

    autocomplete() {
      let { focused, input, selected, state, styles } = prompt;
      if (!focused || !state.submitted) return input;

      if (Array.isArray(selected)) {
        return selected.map(ch => styles.primary(ch.message)).join(', ');
      }

      let value = (prompt.value = prompt.input = focused.value);
      return styles.primary(value);
    },

    boolean(value = prompt.value) {
      let { styles, state } = prompt;
      return !state.submitted ? styles.primary(value) : styles.success(value);
    },

    invisible() {
      return '';
    },

    list() {
      let { list, state, styles } = prompt;
      let style = state.submitted ? styles.primary : val => val;
      return list.map(style).join(', ');
    },

    form(value) {
      return !prompt.state.submitted ? superFormat(value) : '';
    },

    number(input = prompt.input) {
      return prompt.styles.info(input);
    },

    password() {
      let { input, state, styles, symbols } = prompt;
      let color = state.submitted ? styles.primary : styles.muted;
      return color(symbols.asterisk.repeat(input.length));
    },

    scale() {
      let { choices, state, styles } = prompt;
      if (state.submitted) {
        return choices.map(ch => styles.info(ch.index)).join(', ');
      }
      return '';
    },

    select() {
      let { focused, selected, state, styles } = prompt;
      // if (!state.submitted) return prompt.styles.muted(prompt.state.hint);;
      if (!state.submitted) return '';
      if (Array.isArray(selected)) {
        return selected.map(ch => styles.primary(ch.name)).join(', ');
      }
      return styles.primary(focused.name);
    },

    snippet(value) {
      let { state, styles } = prompt;
      let color = state.completed < 100 ? styles.warning : styles.success;
      if (state.submitted && state.completed !== 100) {
        color = styles.danger;
      }
      return color(`${state.completed}% completed`);
    },

    string(value = prompt.value) {
      if (!prompt.state.submitted) {
        return placeholder(prompt, value, prompt.initial, prompt.cursor);
      }
      return prompt.styles.submitted(value || prompt.initial);
    },

    survey(...args) {
      return format.scale(...args);
    }
  };

  return format;
};
