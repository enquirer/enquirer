import createAutocomplete from './autocomplete.js';
import createBasicAuth from './basicauth.js';
import createConfirm from './confirm.js';
import createEditable from './editable.js';
import createForm from './form.js';
import createInput from './input.js';
import createInvisible from './invisible.js';
import createList from './list.js';
import createMultiSelect from './multiselect.js';
import createNumeral from './numeral.js';
import createPassword from './password.js';
import createScale from './scale.js';
import createSelect from './select.js';
import createSnippet from './snippet.js';
import createSort from './sort.js';
import createSurvey from './survey.js';
import createText from './text.js';
import createToggle from './toggle.js';
import createQuiz from './quiz.js';

const factories = {
  AutoComplete: createAutocomplete,
  BasicAuth: createBasicAuth,
  Confirm: createConfirm,
  Editable: createEditable,
  Form: createForm,
  Input: createInput,
  Invisible: createInvisible,
  List: createList,
  MultiSelect: createMultiSelect,
  Numeral: createNumeral,
  Password: createPassword,
  Scale: createScale,
  Select: createSelect,
  Snippet: createSnippet,
  Sort: createSort,
  Survey: createSurvey,
  Text: createText,
  Toggle: createToggle,
  Quiz: createQuiz
};

export default function createPrompts(platformShims) {
  return Object.entries(factories)
    .reduce((seed, [name, factory]) => {
      const promptClass = factory(platformShims);
      seed[name] = promptClass;
      seed[name.toLowerCase()] = promptClass;
      return seed;
    }, {});
}
