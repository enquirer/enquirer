import assert from 'assert'
import { assertType } from 'type-plus'
import Enquirer, { Prompt, ChoiceOptions } from '..'
import { testType } from './support'
// AutoComplete Prompt
// Form Prompt
// List Prompt
// MultiSelect Prompt
// Select Prompt
// Sort Prompt
// Snippet Prompt

describe('input prompt', () => {
  it('prompt with mininum option', () => {
    const { prompt } = Enquirer
    testType(() => prompt({
      type: 'input',
      name: 'color',
      message: 'Favorite color?',
    }))
  })

  it('skip will skip the prompt', async () => {
    const { prompt } = Enquirer
    const answer = await prompt({
      type: 'input',
      name: 'color',
      message: 'Favorite color?',
      skip: true
    })

    assert.deepEqual(answer, { color: '' })
  })

  it('skip with function', async () => {
    const { prompt } = Enquirer
    const answer = await prompt({
      type: 'input',
      name: 'color',
      message: 'Favorite color?',
      skip: () => true
    })

    assert.deepEqual(answer, { color: '' })
  })

  it('skip with async function', async () => {
    const { prompt } = Enquirer
    const answer = await prompt({
      type: 'input',
      name: 'color',
      message: 'Favorite color?',
      skip: () => Promise.resolve(true)
    })

    assert.deepEqual(answer, { color: '' })
  })

  it('skip with delayed async function', async () => {
    const { prompt } = Enquirer
    const answer = await prompt({
      type: 'input',
      name: 'color',
      message: 'Favorite color?',
      skip: () => new Promise(a => setImmediate(() => a(true)))
    })

    assert.deepEqual(answer, { color: '' })
  })

  it('specify initial value', async () => {
    const { prompt } = Enquirer
    prompt.on('prompt', prompt => prompt.submit())
    const answer = await prompt({
      type: 'input',
      name: 'color',
      message: 'Favorite color?',
      initial: 'blue',
      show: false
    })

    assert.deepEqual(answer, { color: 'blue' })
  })

  it('initial with function', async () => {
    const { prompt } = Enquirer
    prompt.on('prompt', prompt => prompt.submit())
    const answer = await prompt({
      type: 'input',
      name: 'color',
      message: 'Favorite color?',
      initial: () => 'blue',
      show: false
    })

    assert.deepEqual(answer, { color: 'blue' })
  })

  it('initial with async function', async () => {
    const { prompt } = Enquirer
    prompt.on('prompt', prompt => prompt.submit())
    const answer = await prompt({
      type: 'input',
      name: 'color',
      message: 'Favorite color?',
      initial: () => Promise.resolve('blue'),
      show: false
    })

    assert.deepEqual(answer, { color: 'blue' })
  })

  it.skip('initial with delayed async function', async () => {
    const { prompt } = Enquirer
    prompt.on('prompt', prompt => prompt.submit())
    const answer = await prompt({
      type: 'input',
      name: 'color',
      message: 'Favorite color?',
      initial: () => new Promise(a => setImmediate(() => a('blue'))),
      show: false
    })

    assert.deepEqual(answer, { color: 'blue' })
  })

  it('specify format function', async () => {
    let called = false
    const { prompt } = Enquirer
    prompt.on('prompt', prompt => prompt.submit())
    const answer = await prompt({
      type: 'input',
      name: 'color',
      message: 'Favorite color?',
      initial: 'blue',
      format(value) {
        called = true
        assertType.isString(value)
        return value
      },
      show: false
    })

    assert.deepEqual(answer, { color: 'blue' })
    assert.ok(called)
  })

  it('specify format async function', async () => {
    const { prompt } = Enquirer
    prompt.on('prompt', prompt => prompt.submit())
    const answer = await prompt({
      type: 'input',
      name: 'color',
      message: 'Favorite color?',
      show: false,
      initial: 'blue',
      format(value) {
        assertType.isString(value)
        return Promise.resolve(value)
      }
    })

    assert.deepEqual(answer, { color: 'blue' })
  })

  it(`format function receives Prompt as 'this'`, async () => {
    const { prompt } = Enquirer
    prompt.on('prompt', prompt => prompt.submit())
    const answer = await prompt({
      type: 'input',
      name: 'color',
      message: 'Favorite color?',
      show: false,
      initial: 'blue',
      format(value) {
        assertType<Prompt<string>>(this)
        return value
      }
    })

    assert.deepEqual(answer, { color: 'blue' })
  })

  it('specify result function', async () => {
    const { prompt } = Enquirer
    prompt.on('prompt', prompt => prompt.submit())
    const answer = await prompt({
      type: 'input',
      name: 'color',
      message: 'Favorite color?',
      show: false,
      initial: 'blue',
      result(value) {
        assertType.isString(value)
        return value + 'r'
      }
    })

    assert.deepEqual(answer, { color: 'bluer' })
  })

  it('specify result async function', async () => {
    const { prompt } = Enquirer
    prompt.on('prompt', prompt => prompt.submit())
    const answer = await prompt({
      type: 'input',
      name: 'color',
      message: 'Favorite color?',
      show: false,
      initial: 'blue',
      result(value) {
        assertType.isString(value)
        return Promise.resolve(value + 'r')
      }
    })

    assert.deepEqual(answer, { color: 'bluer' })
  })

  it(`result function receives Prompt as 'this'`, async () => {
    const { prompt } = Enquirer
    prompt.on('prompt', prompt => prompt.submit())
    const answer = await prompt({
      type: 'input',
      name: 'color',
      message: 'Favorite color?',
      show: false,
      initial: 'blue',
      result(value) {
        assertType<Prompt<string>>(this)
        assert(this instanceof Enquirer.Prompt)
        return value
      }
    })

    assert.deepEqual(answer, { color: 'blue' })
  })

  it.skip('specify validate function', async () => {
    const { prompt } = Enquirer
    prompt.on('prompt', prompt => prompt.submit())
    const answer = await prompt({
      type: 'input',
      name: 'color',
      message: 'Favorite color?',
      show: false,
      initial: 'blue',
      validate(value) {
        assertType.isString(value)
        return ''
      }
    })

    assert.deepEqual(answer, { color: 'bluer' })
  })

  it('specify validate with boolean function', async () => {
    const { prompt } = Enquirer
    prompt.on('prompt', prompt => prompt.submit())
    const answer = await prompt({
      type: 'input',
      name: 'color',
      message: 'Favorite color?',
      show: false,
      initial: 'blue',
      validate(value) {
        assertType.isString(value)
        return true
      }
    })

    assert.deepEqual(answer, { color: 'blue' })
  })

  it('specify validate async boolean function', async () => {
    const { prompt } = Enquirer
    prompt.on('prompt', prompt => prompt.submit())
    const answer = await prompt({
      type: 'input',
      name: 'color',
      message: 'Favorite color?',
      show: false,
      initial: 'blue',
      validate(value) {
        assertType.isString(value)
        return Promise.resolve(true)
      }
    })

    assert.deepEqual(answer, { color: 'blue' })
  })

  it(`validate function receives Prompt as 'this'`, async () => {
    const { prompt } = Enquirer
    prompt.on('prompt', prompt => prompt.submit())
    const answer = await prompt({
      type: 'input',
      name: 'color',
      message: 'Favorite color?',
      show: false,
      initial: 'blue',
      validate() {
        assertType<Prompt<string>>(this)
        assert(this instanceof Enquirer.Prompt)
        return true
      }
    })

    assert.deepEqual(answer, { color: 'blue' })
  })
});

describe('confirm prompt', () => {
  it('prompt with mininum option', () => {
    const { prompt } = Enquirer
    testType(() => prompt({
      type: 'confirm',
      name: 'question',
      message: 'Want to answer?',
    }))
  })

  it('skip will skip the prompt', async () => {
    const { prompt } = Enquirer
    prompt.on('prompt', prompt => prompt.submit())
    const answer = await prompt({
      type: 'confirm',
      name: 'question',
      message: 'Want to answer?',
      skip: true
    })

    assert.deepEqual(answer, { question: false })
  })

  it('skip with function', async () => {
    const { prompt } = Enquirer
    prompt.on('prompt', prompt => prompt.submit())
    const answer = await prompt({
      type: 'confirm',
      name: 'question',
      message: 'Want to answer?',
      skip: () => true
    })

    assert.deepEqual(answer, { question: false })
  })

  it('skip with async function', async () => {
    const { prompt } = Enquirer
    prompt.on('prompt', prompt => prompt.submit())
    const answer = await prompt({
      type: 'confirm',
      name: 'question',
      message: 'Want to answer?',
      skip: () => Promise.resolve(true)
    })

    assert.deepEqual(answer, { question: false })
  })

  it('skip with delayed async function', async () => {
    const { prompt } = Enquirer
    prompt.on('prompt', prompt => prompt.submit())
    const answer = await prompt({
      type: 'confirm',
      name: 'question',
      message: 'Want to answer?',
      skip: () => new Promise(a => setImmediate(() => a(true)))
    })

    assert.deepEqual(answer, { question: false })
  })

  it('specify initial value', async () => {
    const { prompt } = Enquirer
    prompt.on('prompt', prompt => prompt.submit())
    const answer = await prompt({
      type: 'confirm',
      name: 'question',
      message: 'Want to answer?',
      show: false,
      initial: true
    })

    assert.deepEqual(answer, { question: true })
  })

  it.skip('initial with function', async () => {
    const { prompt } = Enquirer
    prompt.on('prompt', prompt => prompt.submit())
    const answer = await prompt({
      type: 'confirm',
      name: 'question',
      message: 'Want to answer?',
      show: false,
      initial: () => true
    })

    assert.deepEqual(answer, { question: true })
  })

  it.skip('initial with async function', async () => {
    const { prompt } = Enquirer
    prompt.on('prompt', prompt => prompt.submit())
    const answer = await prompt({
      type: 'confirm',
      name: 'question',
      message: 'Want to answer?',
      show: false,
      initial: () => Promise.resolve(true)
    })

    assert.deepEqual(answer, { question: true })
  })

  it.skip('initial with async function', async () => {
    const { prompt } = Enquirer
    prompt.on('prompt', prompt => prompt.submit())
    const answer = await prompt({
      type: 'confirm',
      name: 'question',
      message: 'Want to answer?',
      show: false,
      initial: () => new Promise(a => setImmediate(() => a(true)))
    })

    assert.deepEqual(answer, { question: true })
  })

  it('specify format function', async () => {
    const { prompt } = Enquirer
    prompt.on('prompt', prompt => prompt.submit())
    const answer = await prompt({
      type: 'confirm',
      name: 'question',
      message: 'Want to answer?',
      show: false,
      initial: true,
      format(value) {
        assertType.isBoolean(value)
        return `(${value})`
      }
    })

    assert.deepEqual(answer, { question: true })
  })

  it('specify format async function', async () => {
    const { prompt } = Enquirer
    prompt.on('prompt', prompt => prompt.submit())
    const answer = await prompt({
      type: 'confirm',
      name: 'question',
      message: 'Want to answer?',
      show: false,
      initial: true,
      format(value) {
        assertType.isBoolean(value)
        return Promise.resolve(`(${value})`)
      }
    })

    assert.deepEqual(answer, { question: true })
  })

  it(`format function receives Prompt as 'this'`, async () => {
    const { prompt } = Enquirer
    prompt.on('prompt', prompt => prompt.submit())
    const answer = await prompt({
      type: 'confirm',
      name: 'question',
      message: 'Want to answer?',
      show: false,
      initial: true,
      format(value) {
        assertType<Prompt<boolean>>(this)
        return `(${value})`
      }
    })

    assert.deepEqual(answer, { question: true })
  })

  it('specify result function', async () => {
    const { prompt } = Enquirer
    prompt.on('prompt', prompt => prompt.submit())
    const answer = await prompt({
      type: 'confirm',
      name: 'question',
      message: 'Want to answer?',
      show: false,
      initial: true,
      result(value) {
        assertType.isBoolean(value)
        return value
      }
    })

    assert.deepEqual(answer, { question: true })
  })

  it('specify result async function', async () => {
    const { prompt } = Enquirer
    prompt.on('prompt', prompt => prompt.submit())
    const answer = await prompt({
      type: 'confirm',
      name: 'question',
      message: 'Want to answer?',
      show: false,
      initial: true,
      result(value) {
        assertType.isBoolean(value)
        return Promise.resolve(value)
      }
    })

    assert.deepEqual(answer, { question: true })
  })

  it(`result function receives Prompt as 'this'`, async () => {
    const { prompt } = Enquirer
    prompt.on('prompt', prompt => prompt.submit())
    const answer = await prompt({
      type: 'confirm',
      name: 'question',
      message: 'Want to answer?',
      show: false,
      initial: true,
      result(value) {
        assertType<Prompt<boolean>>(this)
        assert(this instanceof Enquirer.Prompt)
        return value
      }
    })

    assert.deepEqual(answer, { question: true })
  })

  it.skip('specify validate function', async () => {
    const { prompt } = Enquirer
    prompt.on('prompt', prompt => prompt.submit())
    const answer = await prompt({
      type: 'confirm',
      name: 'question',
      message: 'Want to answer?',
      show: false,
      initial: true,
      validate(value) {
        assertType.isBoolean(value)
        return ''
      }
    })

    assert.deepEqual(answer, { question: true })
  })

  it('specify validate with boolean function', async () => {
    const { prompt } = Enquirer
    prompt.on('prompt', prompt => prompt.submit())
    const answer = await prompt({
      type: 'confirm',
      name: 'question',
      message: 'Want to answer?',
      show: false,
      initial: true,
      validate(value) {
        assertType.isBoolean(value)
        return true
      }
    })

    assert.deepEqual(answer, { question: true })
  })

  it('specify validate async boolean function', async () => {
    const { prompt } = Enquirer
    prompt.on('prompt', prompt => prompt.submit())
    const answer = await prompt({
      type: 'confirm',
      name: 'question',
      message: 'Want to answer?',
      show: false,
      initial: true,
      validate(value) {
        assertType.isBoolean(value)
        return Promise.resolve(true)
      }
    })

    assert.deepEqual(answer, { question: true })
  })

  it(`validate function receives Prompt as 'this'`, async () => {
    const { prompt } = Enquirer
    prompt.on('prompt', prompt => prompt.submit())
    const answer = await prompt({
      type: 'confirm',
      name: 'question',
      message: 'Want to answer?',
      show: false,
      initial: true,
      validate() {
        assertType<Prompt<boolean>>(this)
        assert(this instanceof Enquirer.Prompt)
        return true
      }
    })

    assert.deepEqual(answer, { question: true })
  })
});

describe('numeral prompt', () => {
  it('prompt with mininum option', () => {
    const { prompt } = Enquirer
    testType(() => prompt({
      type: 'numeral',
      name: 'number',
      message: 'Please enter a number',
    }))
  })

  it('skip will skip the prompt', async () => {
    const { prompt } = Enquirer
    prompt.on('prompt', prompt => prompt.submit())
    const answer = await prompt({
      type: 'numeral',
      name: 'number',
      message: 'Please enter a number',
      skip: true
    })

    assert.deepEqual(answer, { number: 0 })
  })

  it('skip with function', async () => {
    const { prompt } = Enquirer
    prompt.on('prompt', prompt => prompt.submit())
    const answer = await prompt({
      type: 'numeral',
      name: 'number',
      message: 'Please enter a number',
      skip: () => true
    })

    assert.deepEqual(answer, { number: 0 })
  })

  it('skip with async function', async () => {
    const { prompt } = Enquirer
    prompt.on('prompt', prompt => prompt.submit())
    const answer = await prompt({
      type: 'numeral',
      name: 'number',
      message: 'Please enter a number',
      skip: () => Promise.resolve(true)
    })

    assert.deepEqual(answer, { number: 0 })
  })

  it('skip with delayed async function', async () => {
    const { prompt } = Enquirer
    prompt.on('prompt', prompt => prompt.submit())
    const answer = await prompt({
      type: 'numeral',
      name: 'number',
      message: 'Please enter a number',
      skip: () => new Promise(a => setImmediate(() => a(true)))
    })

    assert.deepEqual(answer, { number: 0 })
  })

  it('specify initial value', async () => {
    const { prompt } = Enquirer
    prompt.on('prompt', prompt => prompt.submit())
    const answer = await prompt({
      type: 'numeral',
      name: 'number',
      message: 'Please enter a number',
      show: false,
      initial: 123
    })

    assert.deepEqual(answer, { number: 123 })
  })

  it.skip('initial with function', async () => {
    const { prompt } = Enquirer
    prompt.on('prompt', prompt => prompt.submit())
    const answer = await prompt({
      type: 'numeral',
      name: 'number',
      message: 'Please enter a number',
      show: false,
      initial: () => 123
    })

    assert.deepEqual(answer, { number: 123 })
  })

  it.skip('initial with async function', async () => {
    const { prompt } = Enquirer
    prompt.on('prompt', prompt => prompt.submit())
    const answer = await prompt({
      type: 'numeral',
      name: 'number',
      message: 'Please enter a number',
      show: false,
      initial: () => Promise.resolve(123)
    })

    assert.deepEqual(answer, { number: 123 })
  })

  it.skip('initial with async function', async () => {
    const { prompt } = Enquirer
    prompt.on('prompt', prompt => prompt.submit())
    const answer = await prompt({
      type: 'numeral',
      name: 'number',
      message: 'Please enter a number',
      show: false,
      initial: () => new Promise(a => setImmediate(() => a(123)))
    })

    assert.deepEqual(answer, { number: 123 })
  })

  it('specify format function', async () => {
    const { prompt } = Enquirer
    prompt.on('prompt', prompt => prompt.submit())
    const answer = await prompt({
      type: 'numeral',
      name: 'number',
      message: 'Please enter a number',
      show: false,
      initial: 123,
      format(value) {
        assertType.isNumber(value)
        return `(${value})`
      }
    })

    assert.deepEqual(answer, { number: 123 })
  })

  it('specify format async function', async () => {
    const { prompt } = Enquirer
    prompt.on('prompt', prompt => prompt.submit())
    const answer = await prompt({
      type: 'numeral',
      name: 'number',
      message: 'Please enter a number',
      show: false,
      initial: 123,
      format(value) {
        assertType.isNumber(value)
        return Promise.resolve(`(${value})`)
      }
    })

    assert.deepEqual(answer, { number: 123 })
  })

  it(`format function receives Prompt as 'this'`, async () => {
    const { prompt } = Enquirer
    prompt.on('prompt', prompt => prompt.submit())
    const answer = await prompt({
      type: 'numeral',
      name: 'number',
      message: 'Please enter a number',
      show: false,
      initial: 123,
      format(value) {
        assertType<Prompt<number>>(this)
        return `(${value})`
      }
    })

    assert.deepEqual(answer, { number: 123 })
  })

  it('specify result function', async () => {
    const { prompt } = Enquirer
    prompt.on('prompt', prompt => prompt.submit())
    const answer = await prompt({
      type: 'numeral',
      name: 'number',
      message: 'Please enter a number',
      show: false,
      initial: 123,
      result(value) {
        assertType.isNumber(value)
        return value
      }
    })

    assert.deepEqual(answer, { number: 123 })
  })

  it('specify result async function', async () => {
    const { prompt } = Enquirer
    prompt.on('prompt', prompt => prompt.submit())
    const answer = await prompt({
      type: 'numeral',
      name: 'number',
      message: 'Please enter a number',
      show: false,
      initial: 123,
      result(value) {
        assertType.isNumber(value)
        return Promise.resolve(value)
      }
    })

    assert.deepEqual(answer, { number: 123 })
  })

  it(`result function receives Prompt as 'this'`, async () => {
    const { prompt } = Enquirer
    prompt.on('prompt', prompt => prompt.submit())
    const answer = await prompt({
      type: 'numeral',
      name: 'number',
      message: 'Please enter a number',
      show: false,
      initial: 123,
      result(value) {
        assertType<Prompt<number>>(this)
        assert(this instanceof Enquirer.Prompt)
        return value
      }
    })

    assert.deepEqual(answer, { number: 123 })
  })

  it.skip('specify validate function', async () => {
    const { prompt } = Enquirer
    prompt.on('prompt', prompt => prompt.submit())
    const answer = await prompt({
      type: 'numeral',
      name: 'number',
      message: 'Please enter a number',
      show: false,
      initial: 123,
      validate(value) {
        assertType.isNumber(value)
        return ''
      }
    })

    assert.deepEqual(answer, { number: 123 })
  })

  it('specify validate with boolean function', async () => {
    const { prompt } = Enquirer
    prompt.on('prompt', prompt => prompt.submit())
    const answer = await prompt({
      type: 'numeral',
      name: 'number',
      message: 'Please enter a number',
      show: false,
      initial: 123,
      validate(value) {
        assertType.isNumber(value)
        return true
      }
    })

    assert.deepEqual(answer, { number: 123 })
  })

  it('specify validate async boolean function', async () => {
    const { prompt } = Enquirer
    prompt.on('prompt', prompt => prompt.submit())
    const answer = await prompt({
      type: 'numeral',
      name: 'number',
      message: 'Please enter a number',
      show: false,
      initial: 123,
      validate(value) {
        assertType.isNumber(value)
        return Promise.resolve(true)
      }
    })

    assert.deepEqual(answer, { number: 123 })
  })

  it(`validate function receives Prompt as 'this'`, async () => {
    const { prompt } = Enquirer
    prompt.on('prompt', prompt => prompt.submit())
    const answer = await prompt({
      type: 'numeral',
      name: 'number',
      message: 'Please enter a number',
      show: false,
      initial: 123,
      validate() {
        assertType<Prompt<number>>(this)
        assert(this instanceof Enquirer.Prompt)
        return true
      }
    })

    assert.deepEqual(answer, { number: 123 })
  })
});

describe('password prompt', () => {
  it('prompt with mininum option', () => {
    const { prompt } = Enquirer
    testType(() => prompt({
      type: 'password',
      name: 'password',
      message: 'What is your password?',
    }))
  })

  it('skip will skip the prompt', async () => {
    const { prompt } = Enquirer
    prompt.on('prompt', prompt => prompt.submit())
    const answer = await prompt({
      type: 'password',
      name: 'password',
      message: 'What is your password?',
      skip: true
    })

    assert.deepEqual(answer, { password: '' })
  })

  it('skip with function', async () => {
    const { prompt } = Enquirer
    prompt.on('prompt', prompt => prompt.submit())
    const answer = await prompt({
      type: 'password',
      name: 'password',
      message: 'What is your password?',
      skip: () => true
    })

    assert.deepEqual(answer, { password: '' })
  })

  it('skip with async function', async () => {
    const { prompt } = Enquirer
    prompt.on('prompt', prompt => prompt.submit())
    const answer = await prompt({
      type: 'password',
      name: 'password',
      message: 'What is your password?',
      skip: () => Promise.resolve(true)
    })

    assert.deepEqual(answer, { password: '' })
  })

  it('skip with delayed async function', async () => {
    const { prompt } = Enquirer
    prompt.on('prompt', prompt => prompt.submit())
    const answer = await prompt({
      type: 'password',
      name: 'password',
      message: 'What is your password?',
      skip: () => new Promise(a => setImmediate(() => a(true)))
    })

    assert.deepEqual(answer, { password: '' })
  })

  it('specify initial value', async () => {
    const { prompt } = Enquirer
    prompt.on('prompt', prompt => prompt.submit())
    const answer = await prompt({
      type: 'password',
      name: 'password',
      message: 'What is your password?',
      show: false,
      initial: 'blue'
    })

    assert.deepEqual(answer, { password: 'blue' })
  })

  it.skip('initial with function', async () => {
    const { prompt } = Enquirer
    prompt.on('prompt', prompt => prompt.submit())
    const answer = await prompt({
      type: 'password',
      name: 'password',
      message: 'What is your password?',
      show: false,
      initial: () => 'blue'
    })

    assert.deepEqual(answer, { password: 'blue' })
  })

  it.skip('initial with async function', async () => {
    const { prompt } = Enquirer
    prompt.on('prompt', prompt => prompt.submit())
    const answer = await prompt({
      type: 'password',
      name: 'password',
      message: 'What is your password?',
      show: false,
      initial: () => Promise.resolve('blue')
    })

    assert.deepEqual(answer, { password: 'blue' })
  })

  it.skip('initial with async function', async () => {
    const { prompt } = Enquirer
    prompt.on('prompt', prompt => prompt.submit())
    const answer = await prompt({
      type: 'password',
      name: 'password',
      message: 'What is your password?',
      show: false,
      initial: () => new Promise(a => setImmediate(() => a('blue')))
    })

    assert.deepEqual(answer, { password: 'blue' })
  })

  it('specify format function', async () => {
    const { prompt } = Enquirer
    prompt.on('prompt', prompt => prompt.submit())
    const answer = await prompt({
      type: 'password',
      name: 'password',
      message: 'What is your password?',
      show: false,
      initial: 'blue',
      format(value) {
        assertType.isString(value)
        return value
      }
    })

    assert.deepEqual(answer, { password: 'blue' })
  })

  it('specify format async function', async () => {
    const { prompt } = Enquirer
    prompt.on('prompt', prompt => prompt.submit())
    const answer = await prompt({
      type: 'password',
      name: 'password',
      message: 'What is your password?',
      show: false,
      initial: 'blue',
      format(value) {
        assertType.isString(value)
        return Promise.resolve(value)
      }
    })

    assert.deepEqual(answer, { password: 'blue' })
  })

  it(`format function receives Prompt as 'this'`, async () => {
    const { prompt } = Enquirer
    prompt.on('prompt', prompt => prompt.submit())
    const answer = await prompt({
      type: 'password',
      name: 'password',
      message: 'What is your password?',
      show: false,
      initial: 'blue',
      format(value) {
        assertType<Prompt<string>>(this)
        return value
      }
    })

    assert.deepEqual(answer, { password: 'blue' })
  })

  it('specify result function', async () => {
    const { prompt } = Enquirer
    prompt.on('prompt', prompt => prompt.submit())
    const answer = await prompt({
      type: 'password',
      name: 'password',
      message: 'What is your password?',
      show: false,
      initial: 'blue',
      result(value) {
        assertType.isString(value)
        return value + 'r'
      }
    })

    assert.deepEqual(answer, { password: 'bluer' })
  })

  it('specify result async function', async () => {
    const { prompt } = Enquirer
    prompt.on('prompt', prompt => prompt.submit())
    const answer = await prompt({
      type: 'password',
      name: 'password',
      message: 'What is your password?',
      show: false,
      initial: 'blue',
      result(value) {
        assertType.isString(value)
        return Promise.resolve(value + 'r')
      }
    })

    assert.deepEqual(answer, { password: 'bluer' })
  })

  it(`result function receives Prompt as 'this'`, async () => {
    const { prompt } = Enquirer
    prompt.on('prompt', prompt => prompt.submit())
    const answer = await prompt({
      type: 'password',
      name: 'password',
      message: 'What is your password?',
      show: false,
      initial: 'blue',
      result(value) {
        assertType<Prompt<string>>(this)
        assert(this instanceof Enquirer.Prompt)
        return value
      }
    })

    assert.deepEqual(answer, { password: 'blue' })
  })

  it.skip('specify validate function', async () => {
    const { prompt } = Enquirer
    prompt.on('prompt', prompt => prompt.submit())
    const answer = await prompt({
      type: 'password',
      name: 'password',
      message: 'What is your password?',
      show: false,
      initial: 'blue',
      validate(value) {
        assertType.isString(value)
        return ''
      }
    })

    assert.deepEqual(answer, { password: 'bluer' })
  })

  it('specify validate with boolean function', async () => {
    const { prompt } = Enquirer
    prompt.on('prompt', prompt => prompt.submit())
    const answer = await prompt({
      type: 'password',
      name: 'password',
      message: 'What is your password?',
      show: false,
      initial: 'blue',
      validate(value) {
        assertType.isString(value)
        return true
      }
    })

    assert.deepEqual(answer, { password: 'blue' })
  })

  it('specify validate async boolean function', async () => {
    const { prompt } = Enquirer
    prompt.on('prompt', prompt => prompt.submit())
    const answer = await prompt({
      type: 'password',
      name: 'password',
      message: 'What is your password?',
      show: false,
      initial: 'blue',
      validate(value) {
        assertType.isString(value)
        return Promise.resolve(true)
      }
    })

    assert.deepEqual(answer, { password: 'blue' })
  })

  it(`validate function receives Prompt as 'this'`, async () => {
    const { prompt } = Enquirer
    prompt.on('prompt', prompt => prompt.submit())
    const answer = await prompt({
      type: 'password',
      name: 'password',
      message: 'What is your password?',
      show: false,
      initial: 'blue',
      validate() {
        assertType<Prompt<string>>(this)
        assert(this instanceof Enquirer.Prompt)
        return true
      }
    })

    assert.deepEqual(answer, { password: 'blue' })
  })
});

describe('invisible prompt', () => {
  it('prompt with mininum option', () => {
    const { prompt } = Enquirer
    testType(() => prompt({
      type: 'invisible',
      name: 'secret',
      message: 'What is your secret?',
    }))
  })

  it('skip will skip the prompt', async () => {
    const { prompt } = Enquirer
    prompt.on('prompt', prompt => prompt.submit())
    const answer = await prompt({
      type: 'invisible',
      name: 'secret',
      message: 'What is your secret?',
      skip: true
    })

    assert.deepEqual(answer, { secret: '' })
  })

  it('skip with function', async () => {
    const { prompt } = Enquirer
    prompt.on('prompt', prompt => prompt.submit())
    const answer = await prompt({
      type: 'invisible',
      name: 'secret',
      message: 'What is your secret?',
      skip: () => true
    })

    assert.deepEqual(answer, { secret: '' })
  })

  it('skip with async function', async () => {
    const { prompt } = Enquirer
    prompt.on('prompt', prompt => prompt.submit())
    const answer = await prompt({
      type: 'invisible',
      name: 'secret',
      message: 'What is your secret?',
      skip: () => Promise.resolve(true)
    })

    assert.deepEqual(answer, { secret: '' })
  })

  it('skip with delayed async function', async () => {
    const { prompt } = Enquirer
    prompt.on('prompt', prompt => prompt.submit())
    const answer = await prompt({
      type: 'invisible',
      name: 'secret',
      message: 'What is your secret?',
      skip: () => new Promise(a => setImmediate(() => a(true)))
    })

    assert.deepEqual(answer, { secret: '' })
  })

  it('specify initial value', async () => {
    const { prompt } = Enquirer
    prompt.on('prompt', prompt => prompt.submit())
    const answer = await prompt({
      type: 'invisible',
      name: 'secret',
      message: 'What is your secret?',
      show: false,
      initial: 'blue'
    })

    assert.deepEqual(answer, { secret: 'blue' })
  })

  it.skip('initial with function', async () => {
    const { prompt } = Enquirer
    prompt.on('prompt', prompt => prompt.submit())
    const answer = await prompt({
      type: 'invisible',
      name: 'secret',
      message: 'What is your secret?',
      show: false,
      initial: () => 'blue'
    })

    assert.deepEqual(answer, { secret: 'blue' })
  })

  it.skip('initial with async function', async () => {
    const { prompt } = Enquirer
    prompt.on('prompt', prompt => prompt.submit())
    const answer = await prompt({
      type: 'invisible',
      name: 'secret',
      message: 'What is your secret?',
      show: false,
      initial: () => Promise.resolve('blue')
    })

    assert.deepEqual(answer, { secret: 'blue' })
  })

  it.skip('initial with async function', async () => {
    const { prompt } = Enquirer
    prompt.on('prompt', prompt => prompt.submit())
    const answer = await prompt({
      type: 'invisible',
      name: 'secret',
      message: 'What is your secret?',
      show: false,
      initial: () => new Promise(a => setImmediate(() => a('blue')))
    })

    assert.deepEqual(answer, { secret: 'blue' })
  })

  it('specify format function', async () => {
    const { prompt } = Enquirer
    prompt.on('prompt', prompt => prompt.submit())
    const answer = await prompt({
      type: 'invisible',
      name: 'secret',
      message: 'What is your secret?',
      show: false,
      initial: 'blue',
      format(value) {
        assertType.isString(value)
        return value
      }
    })

    assert.deepEqual(answer, { secret: 'blue' })
  })

  it('specify format async function', async () => {
    const { prompt } = Enquirer
    prompt.on('prompt', prompt => prompt.submit())
    const answer = await prompt({
      type: 'invisible',
      name: 'secret',
      message: 'What is your secret?',
      show: false,
      initial: 'blue',
      format(value) {
        assertType.isString(value)
        return Promise.resolve(value)
      }
    })

    assert.deepEqual(answer, { secret: 'blue' })
  })

  it(`format function receives Prompt as 'this'`, async () => {
    const { prompt } = Enquirer
    prompt.on('prompt', prompt => prompt.submit())
    const answer = await prompt({
      type: 'invisible',
      name: 'secret',
      message: 'What is your secret?',
      show: false,
      initial: 'blue',
      format(value) {
        assertType<Prompt<string>>(this)
        return value
      }
    })

    assert.deepEqual(answer, { secret: 'blue' })
  })

  it('specify result function', async () => {
    const { prompt } = Enquirer
    prompt.on('prompt', prompt => prompt.submit())
    const answer = await prompt({
      type: 'invisible',
      name: 'secret',
      message: 'What is your secret?',
      show: false,
      initial: 'blue',
      result(value) {
        assertType.isString(value)
        return value + 'r'
      }
    })

    assert.deepEqual(answer, { secret: 'bluer' })
  })

  it('specify result async function', async () => {
    const { prompt } = Enquirer
    prompt.on('prompt', prompt => prompt.submit())
    const answer = await prompt({
      type: 'invisible',
      name: 'secret',
      message: 'What is your secret?',
      show: false,
      initial: 'blue',
      result(value) {
        assertType.isString(value)
        return Promise.resolve(value + 'r')
      }
    })

    assert.deepEqual(answer, { secret: 'bluer' })
  })

  it(`result function receives Prompt as 'this'`, async () => {
    const { prompt } = Enquirer
    prompt.on('prompt', prompt => prompt.submit())
    const answer = await prompt({
      type: 'invisible',
      name: 'secret',
      message: 'What is your secret?',
      show: false,
      initial: 'blue',
      result(value) {
        assertType<Prompt<string>>(this)
        assert(this instanceof Enquirer.Prompt)
        return value
      }
    })

    assert.deepEqual(answer, { secret: 'blue' })
  })

  it.skip('specify validate function', async () => {
    const { prompt } = Enquirer
    prompt.on('prompt', prompt => prompt.submit())
    const answer = await prompt({
      type: 'invisible',
      name: 'secret',
      message: 'What is your secret?',
      show: false,
      initial: 'blue',
      validate(value) {
        assertType.isString(value)
        return ''
      }
    })

    assert.deepEqual(answer, { secret: 'bluer' })
  })

  it('specify validate with boolean function', async () => {
    const { prompt } = Enquirer
    prompt.on('prompt', prompt => prompt.submit())
    const answer = await prompt({
      type: 'invisible',
      name: 'secret',
      message: 'What is your secret?',
      show: false,
      initial: 'blue',
      validate(value) {
        assertType.isString(value)
        return true
      }
    })

    assert.deepEqual(answer, { secret: 'blue' })
  })

  it('specify validate async boolean function', async () => {
    const { prompt } = Enquirer
    prompt.on('prompt', prompt => prompt.submit())
    const answer = await prompt({
      type: 'invisible',
      name: 'secret',
      message: 'What is your secret?',
      show: false,
      initial: 'blue',
      validate(value) {
        assertType.isString(value)
        return Promise.resolve(true)
      }
    })

    assert.deepEqual(answer, { secret: 'blue' })
  })

  it(`validate function receives Prompt as 'this'`, async () => {
    const { prompt } = Enquirer
    prompt.on('prompt', prompt => prompt.submit())
    const answer = await prompt({
      type: 'invisible',
      name: 'secret',
      message: 'What is your secret?',
      show: false,
      initial: 'blue',
      validate() {
        assertType<Prompt<string>>(this)
        assert(this instanceof Enquirer.Prompt)
        return true
      }
    })

    assert.deepEqual(answer, { secret: 'blue' })
  })
});

describe('toggle prompt', () => {
  it('prompt with mininum option', () => {
    const { prompt } = Enquirer
    testType(() => prompt({
      type: 'toggle',
      name: 'question',
      message: 'Want to answer?',
      enabled: 'Yep',
      disabled: 'Nope',
    }))
  })

  it('skip will skip the prompt', async () => {
    const { prompt } = Enquirer
    prompt.on('prompt', prompt => prompt.submit())
    const answer = await prompt({
      type: 'toggle',
      name: 'question',
      message: 'Want to answer?',
      enabled: 'Yep',
      disabled: 'Nope',
      skip: true
    })

    assert.deepEqual(answer, { question: false })
  })

  it('skip with function', async () => {
    const { prompt } = Enquirer
    prompt.on('prompt', prompt => prompt.submit())
    const answer = await prompt({
      type: 'toggle',
      name: 'question',
      message: 'Want to answer?',
      enabled: 'Yep',
      disabled: 'Nope',
      skip: () => true
    })

    assert.deepEqual(answer, { question: false })
  })

  it('skip with async function', async () => {
    const { prompt } = Enquirer
    prompt.on('prompt', prompt => prompt.submit())
    const answer = await prompt({
      type: 'toggle',
      name: 'question',
      message: 'Want to answer?',
      enabled: 'Yep',
      disabled: 'Nope',
      skip: () => Promise.resolve(true)
    })

    assert.deepEqual(answer, { question: false })
  })

  it('skip with delayed async function', async () => {
    const { prompt } = Enquirer
    prompt.on('prompt', prompt => prompt.submit())
    const answer = await prompt({
      type: 'toggle',
      name: 'question',
      message: 'Want to answer?',
      enabled: 'Yep',
      disabled: 'Nope',
      skip: () => new Promise(a => setImmediate(() => a(true)))
    })

    assert.deepEqual(answer, { question: false })
  })

  it('specify initial value', async () => {
    const { prompt } = Enquirer
    prompt.on('prompt', prompt => prompt.submit())
    const answer = await prompt({
      type: 'toggle',
      name: 'question',
      message: 'Want to answer?',
      enabled: 'Yep',
      disabled: 'Nope',
      show: false,
      initial: true
    })

    assert.deepEqual(answer, { question: true })
  })

  it.skip('initial with function', async () => {
    const { prompt } = Enquirer
    prompt.on('prompt', prompt => prompt.submit())
    const answer = await prompt({
      type: 'toggle',
      name: 'question',
      message: 'Want to answer?',
      enabled: 'Yep',
      disabled: 'Nope',
      show: false,
      initial: () => true
    })

    assert.deepEqual(answer, { question: true })
  })

  it.skip('initial with async function', async () => {
    const { prompt } = Enquirer
    prompt.on('prompt', prompt => prompt.submit())
    const answer = await prompt({
      type: 'toggle',
      name: 'question',
      message: 'Want to answer?',
      enabled: 'Yep',
      disabled: 'Nope',
      show: false,
      initial: () => Promise.resolve(true)
    })

    assert.deepEqual(answer, { question: true })
  })

  it.skip('initial with async function', async () => {
    const { prompt } = Enquirer
    prompt.on('prompt', prompt => prompt.submit())
    const answer = await prompt({
      type: 'toggle',
      name: 'question',
      message: 'Want to answer?',
      enabled: 'Yep',
      disabled: 'Nope',
      show: false,
      initial: () => new Promise(a => setImmediate(() => a(true)))
    })

    assert.deepEqual(answer, { question: true })
  })

  it('specify format function', async () => {
    const { prompt } = Enquirer
    prompt.on('prompt', prompt => prompt.submit())
    const answer = await prompt({
      type: 'toggle',
      name: 'question',
      message: 'Want to answer?',
      enabled: 'Yep',
      disabled: 'Nope',
      show: false,
      initial: true,
      format(value) {
        assertType.isBoolean(value)
        return `(${value})`
      }
    })

    assert.deepEqual(answer, { question: true })
  })

  it('specify format async function', async () => {
    const { prompt } = Enquirer
    prompt.on('prompt', prompt => prompt.submit())
    const answer = await prompt({
      type: 'toggle',
      name: 'question',
      message: 'Want to answer?',
      enabled: 'Yep',
      disabled: 'Nope',
      show: false,
      initial: true,
      format(value) {
        assertType.isBoolean(value)
        return Promise.resolve(`(${value})`)
      }
    })

    assert.deepEqual(answer, { question: true })
  })

  it(`format function receives Prompt as 'this'`, async () => {
    const { prompt } = Enquirer
    prompt.on('prompt', prompt => prompt.submit())
    const answer = await prompt({
      type: 'toggle',
      name: 'question',
      message: 'Want to answer?',
      enabled: 'Yep',
      disabled: 'Nope',
      show: false,
      initial: true,
      format(value) {
        assertType<Prompt<boolean>>(this)
        return `(${value})`
      }
    })

    assert.deepEqual(answer, { question: true })
  })

  it('specify result function', async () => {
    const { prompt } = Enquirer
    prompt.on('prompt', prompt => prompt.submit())
    const answer = await prompt({
      type: 'toggle',
      name: 'question',
      message: 'Want to answer?',
      enabled: 'Yep',
      disabled: 'Nope',
      show: false,
      initial: true,
      result(value) {
        assertType.isBoolean(value)
        return value
      }
    })

    assert.deepEqual(answer, { question: true })
  })

  it('specify result async function', async () => {
    const { prompt } = Enquirer
    prompt.on('prompt', prompt => prompt.submit())
    const answer = await prompt({
      type: 'toggle',
      name: 'question',
      message: 'Want to answer?',
      enabled: 'Yep',
      disabled: 'Nope',
      show: false,
      initial: true,
      result(value) {
        assertType.isBoolean(value)
        return Promise.resolve(value)
      }
    })

    assert.deepEqual(answer, { question: true })
  })

  it(`result function receives Prompt as 'this'`, async () => {
    const { prompt } = Enquirer
    prompt.on('prompt', prompt => prompt.submit())
    const answer = await prompt({
      type: 'toggle',
      name: 'question',
      message: 'Want to answer?',
      enabled: 'Yep',
      disabled: 'Nope',
      show: false,
      initial: true,
      result(value) {
        assertType<Prompt<boolean>>(this)
        assert(this instanceof Enquirer.Prompt)
        return value
      }
    })

    assert.deepEqual(answer, { question: true })
  })

  it.skip('specify validate function', async () => {
    const { prompt } = Enquirer
    prompt.on('prompt', prompt => prompt.submit())
    const answer = await prompt({
      type: 'toggle',
      name: 'question',
      message: 'Want to answer?',
      enabled: 'Yep',
      disabled: 'Nope',
      show: false,
      initial: true,
      validate(value) {
        assertType.isBoolean(value)
        return ''
      }
    })

    assert.deepEqual(answer, { question: true })
  })

  it('specify validate with boolean function', async () => {
    const { prompt } = Enquirer
    prompt.on('prompt', prompt => prompt.submit())
    const answer = await prompt({
      type: 'toggle',
      name: 'question',
      message: 'Want to answer?',
      enabled: 'Yep',
      disabled: 'Nope',
      show: false,
      initial: true,
      validate(value) {
        assertType.isBoolean(value)
        return true
      }
    })

    assert.deepEqual(answer, { question: true })
  })

  it('specify validate async boolean function', async () => {
    const { prompt } = Enquirer
    prompt.on('prompt', prompt => prompt.submit())
    const answer = await prompt({
      type: 'toggle',
      name: 'question',
      message: 'Want to answer?',
      enabled: 'Yep',
      disabled: 'Nope',
      show: false,
      initial: true,
      validate(value) {
        assertType.isBoolean(value)
        return Promise.resolve(true)
      }
    })

    assert.deepEqual(answer, { question: true })
  })

  it(`validate function receives Prompt as 'this'`, async () => {
    const { prompt } = Enquirer
    prompt.on('prompt', prompt => prompt.submit())
    const answer = await prompt({
      type: 'toggle',
      name: 'question',
      message: 'Want to answer?',
      enabled: 'Yep',
      disabled: 'Nope',
      show: false,
      initial: true,
      validate() {
        assertType<Prompt<boolean>>(this)
        assert(this instanceof Enquirer.Prompt)
        return true
      }
    })

    assert.deepEqual(answer, { question: true })
  })
});

describe('basicauth prompt', () => {
  it('prompt with mininum option', () => {
    const { prompt } = Enquirer
    testType(() => prompt({
      type: 'basicauth',
      name: 'authenticated',
      message: 'Please enter your username and password',
      username: 'rajat-sr',
      password: '123',
      showPassword: false,
    }))
  })

  it('skip will skip the prompt', async () => {
    const { prompt } = Enquirer
    prompt.on('prompt', prompt => prompt.submit())
    const answer = await prompt({
      type: 'basicauth',
      name: 'authenticated',
      message: 'Please enter your username and password',
      username: 'rajat-sr',
      password: '123',
      showPassword: false,
      skip: true
    })

    assert.deepEqual(answer, { authenticated: false })
  })

  it('skip with function', async () => {
    const { prompt } = Enquirer
    prompt.on('prompt', prompt => prompt.submit())
    const answer = await prompt({
      type: 'basicauth',
      name: 'authenticated',
      message: 'Please enter your username and password',
      username: 'rajat-sr',
      password: '123',
      showPassword: false,
      skip: () => true
    })

    assert.deepEqual(answer, { authenticated: false })
  })

  it('skip with async function', async () => {
    const { prompt } = Enquirer
    prompt.on('prompt', prompt => prompt.submit())
    const answer = await prompt({
      type: 'basicauth',
      name: 'authenticated',
      message: 'Please enter your username and password',
      username: 'rajat-sr',
      password: '123',
      showPassword: false,
      skip: () => Promise.resolve(true)
    })

    assert.deepEqual(answer, { authenticated: false })
  })

  it('skip with delayed async function', async () => {
    const { prompt } = Enquirer
    prompt.on('prompt', prompt => prompt.submit())
    const answer = await prompt({
      type: 'basicauth',
      name: 'authenticated',
      message: 'Please enter your username and password',
      username: 'rajat-sr',
      password: '123',
      showPassword: false,
      skip: () => new Promise(a => setImmediate(() => a(true))),
    })

    assert.deepEqual(answer, { authenticated: false })
  })

  it('specify format function', async () => {
    const { prompt } = Enquirer
    prompt.on('prompt', prompt => prompt.submit())
    const answer = await prompt({
      type: 'basicauth',
      name: 'authenticated',
      message: 'Please enter your username and password',
      username: 'rajat-sr',
      password: '123',
      showPassword: false,
      show: false,
      format(value) {
        assertType.isBoolean(value)
        return `(${value})`
      }
    })

    assert.deepEqual(answer, { authenticated: false })
  })

  it('specify format async function', async () => {
    const { prompt } = Enquirer
    prompt.on('prompt', prompt => prompt.submit())
    const answer = await prompt({
      type: 'basicauth',
      name: 'authenticated',
      message: 'Please enter your username and password',
      username: 'rajat-sr',
      password: '123',
      showPassword: false,
      show: false,
      format(value) {
        assertType.isBoolean(value)
        return Promise.resolve(`(${value})`)
      }
    })

    assert.deepEqual(answer, { authenticated: false })
  })

  it(`format function receives Prompt as 'this'`, async () => {
    const { prompt } = Enquirer
    prompt.on('prompt', prompt => prompt.submit())
    const answer = await prompt({
      type: 'basicauth',
      name: 'authenticated',
      message: 'Please enter your username and password',
      username: 'rajat-sr',
      password: '123',
      showPassword: false,
      show: false,
      format(value) {
        assertType<Prompt<boolean>>(this)
        return `(${value})`
      }
    })

    assert.deepEqual(answer, { authenticated: false })
  })

  it('specify result function', async () => {
    const { prompt } = Enquirer
    prompt.on('prompt', prompt => prompt.submit())
    const answer = await prompt({
      type: 'basicauth',
      name: 'authenticated',
      message: 'Please enter your username and password',
      username: 'rajat-sr',
      password: '123',
      showPassword: false,
      show: false,
      result(value) {
        assertType.isBoolean(value)
        return value
      }
    })

    assert.deepEqual(answer, { authenticated: false })
  })

  it('specify result async function', async () => {
    const { prompt } = Enquirer
    prompt.on('prompt', prompt => prompt.submit())
    const answer = await prompt({
      type: 'basicauth',
      name: 'authenticated',
      message: 'Please enter your username and password',
      username: 'rajat-sr',
      password: '123',
      showPassword: false,
      show: false,
      result(value) {
        assertType.isBoolean(value)
        return Promise.resolve(value)
      }
    })

    assert.deepEqual(answer, { authenticated: false })
  })

  it(`result function receives Prompt as 'this'`, async () => {
    const { prompt } = Enquirer
    prompt.on('prompt', prompt => prompt.submit())
    const answer = await prompt({
      type: 'basicauth',
      name: 'authenticated',
      message: 'Please enter your username and password',
      username: 'rajat-sr',
      password: '123',
      showPassword: false,
      show: false,
      result(value) {
        assertType<Prompt<boolean>>(this)
        assert(this instanceof Enquirer.Prompt)
        return value
      }
    })

    assert.deepEqual(answer, { authenticated: false })
  })

  it.skip('specify validate function', async () => {
    const { prompt } = Enquirer
    prompt.on('prompt', prompt => prompt.submit())
    const answer = await prompt({
      type: 'basicauth',
      name: 'authenticated',
      message: 'Please enter your username and password',
      username: 'rajat-sr',
      password: '123',
      showPassword: false,
      show: false,
      validate(value) {
        assertType.isBoolean(value)
        return ''
      }
    })

    assert.deepEqual(answer, { authenticated: false })
  })

  it('specify validate with boolean function', async () => {
    const { prompt } = Enquirer
    prompt.on('prompt', prompt => prompt.submit())
    const answer = await prompt({
      type: 'basicauth',
      name: 'authenticated',
      message: 'Please enter your username and password',
      username: 'rajat-sr',
      password: '123',
      showPassword: false,
      show: false,
      validate(value) {
        assertType.isBoolean(value)
        return true
      }
    })

    assert.deepEqual(answer, { authenticated: false })
  })

  it('specify validate async boolean function', async () => {
    const { prompt } = Enquirer
    prompt.on('prompt', prompt => prompt.submit())
    const answer = await prompt({
      type: 'basicauth',
      name: 'authenticated',
      message: 'Please enter your username and password',
      username: 'rajat-sr',
      password: '123',
      showPassword: false,
      show: false,
      validate(value) {
        assertType.isBoolean(value)
        return Promise.resolve(true)
      }
    })

    assert.deepEqual(answer, { authenticated: false })
  })

  it(`validate function receives Prompt as 'this'`, async () => {
    const { prompt } = Enquirer
    prompt.on('prompt', prompt => prompt.submit())
    const answer = await prompt({
      type: 'basicauth',
      name: 'authenticated',
      message: 'Please enter your username and password',
      username: 'rajat-sr',
      password: '123',
      showPassword: false,
      show: false,
      validate() {
        assertType<Prompt<boolean>>(this)
        assert(this instanceof Enquirer.Prompt)
        return true
      }
    })

    assert.deepEqual(answer, { authenticated: false })
  })
});

describe('quiz prompt', () => {
  it('prompt with mininum option', () => {
    const { prompt } = Enquirer
    testType(() => prompt({
      type: 'quiz',
      name: 'countries',
      message: 'How many countries are there in the world?',
      choices: ['165', '175', '185', '195', '205'],
      correctChoice: 3,
    }))
  })

  it.skip('skip will skip the prompt', async () => {
    await testQuizPromptQuestionType({
      type: 'quiz',
      name: 'countries',
      message: 'How many countries are there in the world?',
      choices: ['165', '175', '185', '195', '205'],
      correctChoice: 3,
      initial: 1,
      skip: true
    })
  })

  it.skip('skip with function', async () => {
    await testQuizPromptQuestionType({
      type: 'quiz',
      name: 'countries',
      message: 'How many countries are there in the world?',
      choices: ['165', '175', '185', '195', '205'],
      correctChoice: 3,
      skip: () => true
    })
  })

  it.skip('skip with async function', async () => {
    await testQuizPromptQuestionType({
      type: 'quiz',
      name: 'countries',
      message: 'How many countries are there in the world?',
      choices: ['165', '175', '185', '195', '205'],
      correctChoice: 3,
      skip: () => Promise.resolve(true)
    })
  })

  it.skip('skip with delayed async function', async () => {
    await testQuizPromptQuestionType({
      type: 'quiz',
      name: 'countries',
      message: 'How many countries are there in the world?',
      choices: ['165', '175', '185', '195', '205'],
      correctChoice: 3,
      skip: () => new Promise(a => setImmediate(() => a(true)))
    })
  })

  it('specify initial value (cannot validate as initial only affects ui)', async () => {
    await testQuizPromptQuestionType({
      type: 'quiz',
      name: 'countries',
      message: 'How many countries are there in the world?',
      choices: ['165', '175', '185', '195', '205'],
      correctChoice: 3,
      initial: 1,
      show: false
    })
  })

  it('initial with function (cannot validate as initial only affects ui)', async () => {
    await testQuizPromptQuestionType({
      type: 'quiz',
      name: 'countries',
      message: 'How many countries are there in the world?',
      choices: ['165', '175', '185', '195', '205'],
      correctChoice: 3,
      show: false,
      initial: () => 1
    })
  })

  it('initial with async function (cannot validate as initial only affects ui)', async () => {
    await testQuizPromptQuestionType({
      type: 'quiz',
      name: 'countries',
      message: 'How many countries are there in the world?',
      choices: ['165', '175', '185', '195', '205'],
      correctChoice: 3,
      show: false,
      initial: () => Promise.resolve(1)
    })
  })

  it.skip('initial with delay async function', async () => {
    await testQuizPromptQuestionType({
      type: 'quiz',
      name: 'countries',
      message: 'How many countries are there in the world?',
      choices: ['165', '175', '185', '195', '205'],
      correctChoice: 3,
      show: false,
      initial: () => new Promise(a => setImmediate(() => a(1)))
    })
  });

  it('choice can be promise', async () => {
    await testQuizPromptQuestionType({
      type: 'quiz',
      name: 'countries',
      message: 'How many countries are there in the world?',
      choices: ['165', '175', Promise.resolve('185'), '195', '205'],
      correctChoice: 3,
      initial: 1,
      show: false,
    })
  });

  it('choice can be () => string', async () => {
    await testQuizPromptQuestionType({
      type: 'quiz',
      name: 'countries',
      message: 'How many countries are there in the world?',
      choices: ['165', '175', () => '185', '195', '205'],
      correctChoice: 3,
      initial: 1,
      show: false,
    })
  });

  it('choice can be () => Promise<string>', async () => {
    await testQuizPromptQuestionType({
      type: 'quiz',
      name: 'countries',
      message: 'How many countries are there in the world?',
      choices: ['165', '175', () => Promise.resolve('185'), '195', '205'],
      correctChoice: 3,
      initial: 1,
      show: false,
    })
  });

  it('choice can be () => Promise<string>', async () => {
    await testQuizPromptQuestionType({
      type: 'quiz',
      name: 'countries',
      message: 'How many countries are there in the world?',
      choices: ['165', '175', () => Promise.resolve('185'), '195', '205'],
      correctChoice: 3,
      initial: 1,
      show: false,
    })
  });

  // TODO: this test failes with `Cannot read property 'name' of undefined for some reason
  it.skip('choice can be choice options', async () => {
    const { prompt } = Enquirer
    prompt.on('prompt', prompt => {
      prompt.input = '165'
      prompt.submit()
    })
    const answer = await prompt({
      type: 'quiz',
      name: 'countries',
      message: 'How many countries are there in the world?',
      choices: [
        { value: '165' },
        { value: '175', message: 'abc 175' },
        { value: '185', hint: 'choose this' },
        { value: '195', disabled: false },
        { value: '205', disabled: true },
        { value: '1', message: 'a1', hint: 'not right' },
        { value: '2', hint: 'not right', disabled: true },
        { value: '3', message: 'a3', disabled: true },
        { value: '4', message: 'a4', hint: 'not right', disabled: true },
      ],
      correctChoice: 3,
      initial: 1,
      show: false,
    })

    assert.deepEqual(answer, {
      countries: {
        correct: false,
        correctAnswer: '195',
        selectedAnswer: '165',
      }
    })
  });

  it('specify format function', async () => {
    await testQuizPromptQuestionType({
      type: 'quiz',
      name: 'countries',
      message: 'How many countries are there in the world?',
      choices: ['165', '175', '185', '195', '205'],
      correctChoice: 3,
      show: false,
      initial: 1,
      format(value) {
        assertType.isBoolean(value)
        return `(${value})`
      }
    })
  });

  it('specify format async function', async () => {
    await testQuizPromptQuestionType({
      type: 'quiz',
      name: 'countries',
      message: 'How many countries are there in the world?',
      choices: ['165', '175', '185', '195', '205'],
      correctChoice: 3,
      show: false,
      initial: 1,
      format(value) {
        assertType.isBoolean(value)
        return `(${value})`
      }
    })
  });

  it(`format function receives Prompt as 'this'`, async () => {
    await testQuizPromptQuestionType({
      type: 'quiz',
      name: 'countries',
      message: 'How many countries are there in the world?',
      choices: ['165', '175', '185', '195', '205'],
      correctChoice: 3,
      show: false,
      initial: 1,
      format(value) {
        assertType<Prompt<Enquirer.prompt.QuizQuestion.Answer>>(this)
        assertType.isBoolean(value)
        return `(${value})`
      }
    })
  });

  async function testQuizPromptQuestionType(question: Enquirer.prompt.QuizQuestion) {
    const { prompt } = Enquirer
    prompt.on('prompt', prompt => {
      prompt.input = '165'
      prompt.submit()
    })
    const answer = await prompt(question)

    assert.deepEqual(answer, {
      countries: {
        correct: false,
        correctAnswer: '195',
        selectedAnswer: '165',
      }
    })
  }
});

describe('scale prompt', () => {
  const defaultScaleQuestion = {
    type: 'scale' as const,
    name: 'experience',
    message: 'Please rate your experience',
    scale: [
      { name: '1', message: 'Strongly Disagree' },
      { name: '2', message: 'Disagree' },
      { name: '3', message: 'Neutral' },
      { name: '4', message: 'Agree' },
      { name: '5', message: 'Strongly Agree' }
    ],
    choices: [
      {
        name: 'interface',
        message: 'The website has a friendly interface.'
      },
      {
        name: 'navigation',
        message: 'The website is easy to navigate.'
      },
      {
        name: 'images',
        message: 'The website usually has good images.'
      },
      {
        name: 'upload',
        message: 'The website makes it easy to upload images.'
      },
      {
        name: 'colors',
        message: 'The website has a pleasing color palette.'
      }
    ] as Enquirer.prompt.ScaleQuestion.Choice[]
  }
  it('prompt with mininum option', () => {
    const { prompt } = Enquirer

    testType(() => prompt(defaultScaleQuestion))
  })

  it('with margin as an number', async () => {
    const { prompt } = Enquirer

    testType(() => prompt({
      ...defaultScaleQuestion,
      margin: 2
    }))
  });

  it('with margin array', async () => {
    const { prompt } = Enquirer

    testType(() => prompt({
      ...defaultScaleQuestion,
      margin: [1, 2, 3, 4]
    }))
  });

  it('skip will skip the prompt', async () => {
    await testScalePromptQuestionType({
      ...defaultScaleQuestion,
      skip: true
    })
  })

  it('skip with function', async () => {
    await testScalePromptQuestionType({
      ...defaultScaleQuestion,
      skip: () => true
    })
  })

  it('skip with async function', async () => {
    await testScalePromptQuestionType({
      ...defaultScaleQuestion,
      skip: () => Promise.resolve(true)
    })
  })

  it('skip with delayed async function', async () => {
    await testScalePromptQuestionType({
      ...defaultScaleQuestion,
      skip: () => new Promise(a => setImmediate(() => a(true)))
    })
  })

  it('specify initial value (cannot validate as initial only affects ui)', async () => {
    await testScalePromptQuestionType({
      ...defaultScaleQuestion,
      choices: [{
        name: 'interface',
        message: 'The website has a friendly interface.',
        initial: 1
      }, ...defaultScaleQuestion.choices.slice(1)],
      show: false,
    })
  })

  it.skip('choice can be promise', async () => {
    await testScalePromptQuestionType({
      ...defaultScaleQuestion,
      choices: [Promise.resolve({
        name: 'interface',
        message: 'The website has a friendly interface.',
        initial: 1
      }), ...defaultScaleQuestion.choices.slice(1)],
      show: false
    })
  });

  it.skip('choice can be () => ChoiceOptions', async () => {
    await testScalePromptQuestionType({
      ...defaultScaleQuestion,
      choices: [() => ({
        name: 'interface',
        message: 'The website has a friendly interface.',
        initial: 1
      }), ...defaultScaleQuestion.choices.slice(1)],
      show: false
    })
  });

  it.skip('choice can be () => Promise<ChoiceOptions>', async () => {
    await testScalePromptQuestionType({
      ...defaultScaleQuestion,
      choices: [() => Promise.resolve({
        name: 'interface',
        message: 'The website has a friendly interface.',
        initial: 1
      }), ...defaultScaleQuestion.choices.slice(1)],
      show: false
    })
  });

  it('specify format function', async () => {
    await testScalePromptQuestionType({
      ...defaultScaleQuestion,
      format(value) {
        assertType<Record<string, number> | undefined>(value)
        return value ? Object.values(value).join(', ') : ''
      },
      show: false,
    })
  });

  it('specify format async function', async () => {
    await testScalePromptQuestionType({
      ...defaultScaleQuestion,
      async format(value) {
        assertType<Record<string, number> | undefined>(value)
        return value ? Object.values(value).join(', ') : ''
      },
      show: false,
    })
  });

  it(`format function receives Prompt as 'this'`, async () => {
    await testScalePromptQuestionType({
      ...defaultScaleQuestion,
      async format(value) {
        assertType<Prompt<Enquirer.prompt.ScaleQuestion.Answer>>(this)
        return value ? Object.values(value).join(', ') : ''
      },
      show: false,
    })
  });

  it('specify result function', async () => {
    let called = false
    await testScalePromptQuestionType({
      ...defaultScaleQuestion,
      result(value) {
        called = true
        assertType<Record<string, number> | undefined>(value)
        return value
      },
      show: false,
    })

    assert.ok(called)
  });

  it('specify result async function', async () => {
    let called = false
    await testScalePromptQuestionType({
      ...defaultScaleQuestion,
      async result(value) {
        called = true
        assertType<Record<string, number> | undefined>(value)
        return value
      },
      show: false,
    })

    assert.ok(called)
  });

  it(`result function receives Prompt as 'this'`, async () => {
    let called = false
    await testScalePromptQuestionType({
      ...defaultScaleQuestion,
      result(value) {
        called = true
        assertType<Prompt<Enquirer.prompt.ScaleQuestion.Answer>>(this)
        return value
      },
      show: false,
    })

    assert.ok(called)
  });

  async function testScalePromptQuestionType(question: Enquirer.prompt.ScaleQuestion) {
    const { prompt } = Enquirer
    prompt.on('prompt', (prompt: any) => {
      prompt.choices.forEach((c: any) => c.scaleIndex = 2)
      prompt.submit()
    })

    const answer = await prompt(question)

    assert.deepEqual(answer, {
      experience: {
        interface: 2, navigation: 2, images: 2, upload: 2, colors: 2
      }
    })
  }
});
