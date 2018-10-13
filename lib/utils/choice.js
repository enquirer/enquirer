module.exports = (choice, i, parent) => {
  if (Array.isArray(parent)) parent = null;
  if (typeof choice === 'string') {
    choice = { name: choice };
  }

  choice = { ...choice };
  if (!choice.name) choice.name = choice.value || choice.key || choice.title || choice.message;
  if (!choice.message) choice.message = choice.name;
  if (!choice.value) choice.value = choice.name;

  choice.cursor = 0;
  choice.input = '';
  choice.index = i;

  if (choice.disabled) {
    if (typeof choice.disabled === 'string') {
      choice.hint = choice.disabled;
      choice.disabled = true;
    }
    if (!choice.name) {
      choice.name = String(i).padStart(3, '0');
    }
  }

  choice.parent = parent ? parent.name : null;
  choice.indent = parent ? parent.indent + '  ' : (choice.indent || '');
  return choice;
};
