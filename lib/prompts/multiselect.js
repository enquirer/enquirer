import createSelect from './select.js';

export default function createMultiSelect(platformShims) {
  const Select = createSelect(platformShims);

  class MultiSelect extends Select {
    constructor(options) {
      super({ ...options, multiple: true });
    }
  }

  return MultiSelect;
}
