# Properties

## Status

**Type**: `string` (getter/setter)

**Default**: `pending`

**Description**

The `prompt.status` getter is used to determine if a prompt session is still active or has ended. 

### Statuses

| **Name** | **description** |
| --- | --- |
| `pending` | The prompt session has been initialized and is still active. |
| `submitted` | The prompt session has ended, and a value was submitted by the user. |
| `cancelled` | The prompt session has ended, and was terminated by the user or an error. |

### Example Usage

The following example illustrates how to use the prompt `status` to determine the [separator](#separator) to use.

```js
const { symbols } = require('ansi-colors');
const { prompt } = require('enquirer');
const response = await prompt({
  type: 'color',
  name: 'color',
  message: 'Please pick a color',
  choices: ['red', 'blue', 'green', 'yellow', 'red'],
  separator(status) {
    return ({ pending: symbols.middot, submitted: symbols.ellipsis })[status];
  }
});
```

### Customization

It's possible to set the `prompt.status` property to a custom string, but only while the prompt session is `pending`. _The `cancelled` and `submitted` statuses may not be overridden_.