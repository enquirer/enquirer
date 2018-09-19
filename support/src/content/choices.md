# Choices

## Todo

- default choice
- rows - lines
- index - row of the cursor
- disabled
- enabled
- selected
- isEnabled
- if a parent choice is enabled, all children are enabled
- if a parent choice is disabled, all children are disabled

## Choice

### Choice object

```js
Choice {
  name: string;
  type: string | undefined;
  message: string | undefined;
  value: any | undefined;

  // optional properties
  hint: string | undefined;
  disabled: boolean | undefined;
  selected: boolean | undefined;
}
```

| **Property**  | **Type**   | **Description**  |
| --- | --- | --- |
| `name`        | `string`   | The unique id for a choice |
| `message`     | `string`   | The message to display  |
| `value`       | `string`   | The value to return if the choice is selected |
| `alias`       | `string`   | Single character to use when keypress shortcuts are supported |
| `hint`        | `string`   |  |
| `error`       | `string`   |  |
| `disabled`    | `boolean`  |  |
| `separator`   | `boolean`  |  |
| `selected`    | `boolean`  |  |

**Deprecated aliases**

The following aliases are deprecated and may be removed in a future version of enquirer.

- `title` - alias for `message`
- `help` - alias for `hint`
- `checked` - alias for `selected`, for backwards-compatibility with older versions of Enquirer.
- `enabled` - alias for `selected`

