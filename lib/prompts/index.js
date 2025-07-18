import utils from '../utils.js';
import AutoComplete from './autocomplete.js';
import BasicAuth from './basicauth.js';
import Confirm from './confirm.js';
import Editable from './editable.js';
import Form from './form.js';
import Input from './input.js';
import Invisible from './invisible.js';
import List from './list.js';
import MultiSelect from './multiselect.js';
import Numeral from './numeral.js';
import Password from './password.js';
import Scale from './scale.js';
import Select from './select.js';
import Snippet from './snippet.js';
import Sort from './sort.js';
import Survey from './survey.js';
import Text from './text.js';
import Toggle from './toggle.js';
import Quiz from './quiz.js';

const prompts = Object.create({});

const define = (key, fn) => {
  utils.defineExport(prompts, key, fn);
  utils.defineExport(prompts, key.toLowerCase(), fn);
};

define('AutoComplete', () => AutoComplete);
define('BasicAuth', () => BasicAuth);
define('Confirm', () => Confirm);
define('Editable', () => Editable);
define('Form', () => Form);
define('Input', () => Input);
define('Invisible', () => Invisible);
define('List', () => List);
define('MultiSelect', () => MultiSelect);
define('Numeral', () => Numeral);
define('Password', () => Password);
define('Scale', () => Scale);
define('Select', () => Select);
define('Snippet', () => Snippet);
define('Sort', () => Sort);
define('Survey', () => Survey);
define('Text', () => Text);
define('Toggle', () => Toggle);
define('Quiz', () => Quiz);

export default prompts