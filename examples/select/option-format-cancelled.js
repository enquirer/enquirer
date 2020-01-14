const { Select } = require('enquirer');

const prompt = new Select({
  name: 'color',
  message: 'Pick a flavor',
  choices: ['apple', 'grape', 'watermelon', 'cherry', 'orange'],
  format() {
    if (!this.state.submitted || this.state.cancelled) return '';
    if (Array.isArray(this.selected)) {
      return this.selected.map(choice => this.styles.primary(choice.name)).join(', ');
    }
    return this.styles.primary(this.selected.name);
  }
});

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);