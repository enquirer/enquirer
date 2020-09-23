import Select from './select.js';

class MultiSelect extends Select {
  constructor(options) {
    super({ ...options, multiple: true });
  }
}

export default MultiSelect;
