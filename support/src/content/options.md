# Options

Options determine the behavior and appearance of prompts.

## Enquirer options

| **Option name** | **Required?** | **Type** | **Default** | **Description** |
| --- | --- | --- | --- | --- |
| `type` | `required` | `String` | `undefined` | A string representing the question type. This property is necessary for Enquirer to determine the type of prompt to run. |
| `onSubmit` | `optional` | `Function` | `undefined` |  |
| `onCancel` | `optional` | `Function` | `undefined` |  |
| `onState` | `optional` | `Function` | `undefined` |  |

## Prompt options

All prompts accept the following options.

```js
{
  name: String || Function,
  type: String || Function,
  message: String || async Function,
  initial: String || async Function
  format: Function || async Function,
  onState: Function || async Function,
  onCancel: Function || async Function,
  onSubmit: Function || async Function,
  validate: Function || async Function,
  when: Function || async Function,
}
```

| **Option name** | **Required?** | **Type** | **Default** | **Description** |
| --- | --- | --- | --- | --- |
| `name` | `required` | `String` | `undefined` | The name of the prompt, used as the key for the answer on the returned answers object. |
| `messsage` | `optional` | `String|Function` | `undefined` | The message to display when the prompt is rendered in the terminal. If not defined, `name` or `value` is used. |
| `value` | `optional` | any | `undefined` | The default value to return when no other "answer" is given by the user. |
| `default` | `optional` | any | `undefined` | Alias to `value` |
| `hint` | `optional` | `String` | `undefined` | Help message to display after the prompt message. |
| `style` | `optional` | `String` | `undefined` |  |
| `onSubmit` | `optional` | `Function` | `undefined` | Invoked when... |
| `onCancel` | `optional` | `Function` | `undefined` | Invoked when... |
| `onState` | `optional` | `Function` | `undefined` | Invoked when... |
| `format` | `optional` | `Function` | `undefined` | Invoked when... |
| `validate` | `optional` | `Function` | `undefined` | Invoked when... |
| `when` | `optional` | `Function` | `undefined` | Invoked when... |


### Function execution

Some functions defined on the options are invoked when the prompt is initialized, others are invoked when specific events occur.

**Invoked on init**

- `message`
- `choices`

**Invoked on submit**

All other functions.


## Array prompt options

In addition to global [prompt pptions](#prompt-options), array prompts also support the following options:

| **Option name** | **Required?** | **Type** | **Default** | **Description** |
| --- | --- | --- | --- | --- |
| `name` | `required` | `String`  | `undefined` | Used to specify the name of the "question". This is typically used at the `key` on an "answers" object. |
| `required` | `optional` | `Boolean` | `false` | Indicates that the user is required to make a selection. |
| `autocomplete` | `optional` | `Boolean` | `false` | Enables autocomplete features. |
| `autofocus` | `optional` | `Number|String` | `false` | Specifies the item that should have focus when the prompt initializes. The autofocus value must be a number indicating the 0-based-index of the item, or a string indicating the `name` of the item. Only one item may have focus at a time. |
| `choices` | `required` | `Array<String|Object>` | `undefined` | Array of [choices](#choices), formatted as strings or objects. |
| `disabled` | `optional` | `Boolean` | `false` | Indicates that the user may not interact with the item. If this option is not specified, the item inherits its setting from its parent (if applicable). For example, in a choices group if there is no containing item with the disabled option set, then the item is enabled. |
| `initial` | `optional` | `Number|String|Array` | `undefined` | The index or name of the choice to select when the prompt initializes, or an array of indices or names may be provided if the `multiple` option is `required`. |
| `multiple` | `optional` | `Boolean` | `false` | Indicates that multiple options may be selected in the list. By default, only one option may be selected at a time.
| `parent` | `optional` | `Boolean` | `false` | Parent choice, when nested choices ("choice groups") are defined. |
| `limit` | `optional` | `Boolean` | Defaults to `choices.length` | Represents the number of rows (choices) in the list that should be visible in the terminal at one time. Users may scroll up and down to reveal more choices when the entire list is not shown. |

### Choices

Each choice in an array of choices may have the following properties. Each choice _must have either a `name`, `message` or `value`_.

| **Option name** | **Required?** | **Type** | **Default** | **Description** |
| --- | --- | --- | --- | --- |
| `name` | `optional` | `Number` | `choices.length` | The number of choices to make visible in the terminal. Users can scroll up and down to reveal more choices when the entire list is not shown. |
| `choices` | `required` | `Array<String|Object>` | `undefined` | Array or object of child choices. |


### Example options object

The following options object ("question")

```js
const question = {
  type: 'select',
  name: 'colors',
  message: 'Pick a color',
  initial: 1,
  choices: [
    { message: 'Red', value: '#ff0000' },
    { message: 'Green', value: '#00ff00' },
    { message: 'Blue', value: '#0000ff' }
  ]
};
```

### Related array prompts

- [multiselect prompt](prompts/multiselect)
- [select prompt](prompts/select)
- [radio prompt](prompts/radio)
