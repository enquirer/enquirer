import assert from 'assert'
import { assertType } from 'type-plus'
import Enquirer, { Prompt, ChoiceOptions } from '..'
import { testType } from './support'

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
  const minimumQuestion = {
    type: 'quiz' as const,
    name: 'countries',
    message: 'How many countries are there in the world?',
    choices: ['165', '175', '185', '195', '205'],
    correctChoice: 3,
  }

  async function testQuestionType(question: Enquirer.prompt.QuizQuestion) {
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

  it('prompt with mininum option', () => {
    const { prompt } = Enquirer
    testType(() => prompt(minimumQuestion))
  })

  it.skip('skip will skip the prompt', async () => {
    await testQuestionType({
      ...minimumQuestion,
      skip: true
    })
  })

  it.skip('skip with function', async () => {
    await testQuestionType({
      ...minimumQuestion,
      skip: () => true
    })
  })

  it.skip('skip with async function', async () => {
    await testQuestionType({
      ...minimumQuestion,
      skip: () => Promise.resolve(true)
    })
  })

  it.skip('skip with delayed async function', async () => {
    await testQuestionType({
      ...minimumQuestion,
      skip: () => new Promise(a => setImmediate(() => a(true)))
    })
  })

  it('choice can be promise', async () => {
    await testQuestionType({
      ...minimumQuestion,
      choices: ['165', '175', Promise.resolve('185'), '195', '205'],
      show: false,
    })
  });

  it('choice can be () => string', async () => {
    await testQuestionType({
      ...minimumQuestion,
      choices: ['165', '175', () => '185', '195', '205'],
      show: false,
    })
  });

  it('choice can be () => Promise<string>', async () => {
    await testQuestionType({
      ...minimumQuestion,
      choices: ['165', '175', () => Promise.resolve('185'), '195', '205'],
      show: false,
    })
  });

  it.skip('choice can be choice options', async () => {
    await testQuestionType({
      ...minimumQuestion,
      choices: [
        { name: '165' },
        { name: '175', message: 'abc 175' },
        { name: '185', hint: 'choose this' },
        { name: '195', disabled: false },
        { name: '205', disabled: true },
        { name: '1', message: 'a1', hint: 'not right' },
        { name: '2', hint: 'not right', disabled: true },
        { name: '3', message: 'a3', disabled: true },
        { name: '4', message: 'a4', hint: 'not right', disabled: true },
      ],
      show: false,
    })
  });

  it('choice can be () => ChoiceOption', async () => {
    await testQuestionType({
      ...minimumQuestion,
      choices: [() => ({ name: '165' }), '175', '185', '195', '205'],
      show: false,
    })
  });

  it('choice can be () => Promise<ChoiceOption>', async () => {
    await testQuestionType({
      ...minimumQuestion,
      choices: [async () => ({ name: '165' }), '175', '185', '195', '205'],
      show: false,
    })
  });

  it('specify initial value (cannot validate as initial only affects ui)', async () => {
    await testQuestionType({
      ...minimumQuestion,
      initial: 1,
      show: false,
    })
  })

  it('initial with function (cannot validate as initial only affects ui)', async () => {
    await testQuestionType({
      ...minimumQuestion,
      initial: () => 1,
      show: false,
    })
  })

  it('initial with async function (cannot validate as initial only affects ui)', async () => {
    await testQuestionType({
      ...minimumQuestion,
      initial: () => Promise.resolve(1),
      show: false,
    })
  })

  it.skip('initial with delay async function', async () => {
    await testQuestionType({
      ...minimumQuestion,
      initial: () => new Promise(a => setImmediate(() => a(1))),
      show: false,
    })
  });

  it('specify format function', async () => {
    await testQuestionType({
      ...minimumQuestion,
      format(value) {
        assertType.isBoolean(value)
        return `(${value})`
      },
      show: false,
    })
  });

  it('specify format async function', async () => {
    await testQuestionType({
      ...minimumQuestion,
      format(value) {
        assertType.isBoolean(value)
        return `(${value})`
      },
      show: false,
    })
  });

  it(`format function receives Prompt as 'this'`, async () => {
    await testQuestionType({
      ...minimumQuestion,
      format(value) {
        assertType<Prompt<Enquirer.prompt.QuizQuestion.Answer>>(this)
        assertType.isBoolean(value)
        return `(${value})`
      },
      show: false,
    })
  });
});

describe('scale prompt', () => {
  const minimumQuestion = {
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

    testType(() => prompt(minimumQuestion))
  })

  it('with margin as an number', async () => {
    const { prompt } = Enquirer

    testType(() => prompt({
      ...minimumQuestion,
      margin: 2
    }))
  });

  it('with margin array', async () => {
    const { prompt } = Enquirer

    testType(() => prompt({
      ...minimumQuestion,
      margin: [1, 2, 3, 4]
    }))
  });

  it('skip will skip the prompt', async () => {
    await testQuestionType({
      ...minimumQuestion,
      skip: true
    })
  })

  it('skip with function', async () => {
    await testQuestionType({
      ...minimumQuestion,
      skip: () => true
    })
  })

  it('skip with async function', async () => {
    await testQuestionType({
      ...minimumQuestion,
      skip: () => Promise.resolve(true)
    })
  })

  it('skip with delayed async function', async () => {
    await testQuestionType({
      ...minimumQuestion,
      skip: () => new Promise(a => setImmediate(() => a(true)))
    })
  })

  it.skip('choice can be promise', async () => {
    await testQuestionType({
      ...minimumQuestion,
      choices: [Promise.resolve({
        name: 'interface',
        message: 'The website has a friendly interface.',
        initial: 1
      }), ...minimumQuestion.choices.slice(1)],
      show: false
    })
  });

  it.skip('choice can be () => ChoiceOptions', async () => {
    await testQuestionType({
      ...minimumQuestion,
      choices: [() => ({
        name: 'interface',
        message: 'The website has a friendly interface.',
        initial: 1
      }), ...minimumQuestion.choices.slice(1)],
      show: false
    })
  });

  it.skip('choice can be () => Promise<ChoiceOptions>', async () => {
    await testQuestionType({
      ...minimumQuestion,
      choices: [() => Promise.resolve({
        name: 'interface',
        message: 'The website has a friendly interface.',
        initial: 1
      }), ...minimumQuestion.choices.slice(1)],
      show: false
    })
  });

  it.skip('specify align left', async () => {
    await testQuestionType({
      ...minimumQuestion,
      align: 'left'
    })
  })

  it.skip('specify align right', async () => {
    await testQuestionType({
      ...minimumQuestion,
      align: 'right'
    })
  })

  it.skip('specify linebreak', async () => {
    await testQuestionType({
      ...minimumQuestion,
      linebreak: false
    })
  })

  it.skip('specify edgeLength', async () => {
    await testQuestionType({
      ...minimumQuestion,
      edgeLength: 3
    })
  })

  it.skip('specify newline', async () => {
    await testQuestionType({
      ...minimumQuestion,
      newline: '\r\n'
    })
  })

  it.skip('specify messageWidth', async () => {
    await testQuestionType({
      ...minimumQuestion,
      messageWidth: 50
    })
  })

  it.skip('specify startNumber', async () => {
    await testQuestionType({
      ...minimumQuestion,
      startNumber: 1
    })
  })

  it('specify initial value (cannot validate as initial only affects ui)', async () => {
    await testQuestionType({
      ...minimumQuestion,
      choices: [{
        name: 'interface',
        message: 'The website has a friendly interface.',
        initial: 1
      }, ...minimumQuestion.choices.slice(1)],
      show: false,
    })
  })

  it('specify format function', async () => {
    await testQuestionType({
      ...minimumQuestion,
      format(value) {
        assertType<Record<string, number> | undefined>(value)
        return value ? Object.values(value).join(', ') : ''
      },
      show: false,
    })
  });

  it('specify format async function', async () => {
    await testQuestionType({
      ...minimumQuestion,
      async format(value) {
        assertType<Record<string, number> | undefined>(value)
        return value ? Object.values(value).join(', ') : ''
      },
      show: false,
    })
  });

  it(`format function receives Prompt as 'this'`, async () => {
    await testQuestionType({
      ...minimumQuestion,
      async format(value) {
        assertType<Prompt<Enquirer.prompt.ScaleQuestion.Answer>>(this)
        return value ? Object.values(value).join(', ') : ''
      },
      show: false,
    })
  });

  it('specify result function', async () => {
    let called = false
    await testQuestionType({
      ...minimumQuestion,
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
    await testQuestionType({
      ...minimumQuestion,
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
    await testQuestionType({
      ...minimumQuestion,
      result(value) {
        called = true
        assertType<Prompt<Enquirer.prompt.ScaleQuestion.Answer>>(this)
        return value
      },
      show: false,
    })

    assert.ok(called)
  });

  async function testQuestionType(question: Enquirer.prompt.ScaleQuestion) {
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

describe('sort prompt', () => {
  const defaultSortQuestion = {
    type: 'sort' as const,
    name: 'colors',
    message: 'Sort the colors in order of preference',
    choices: [
      {
        name: 'red',
        message: 'color red'
      },
      {
        name: 'white',
        message: 'color white'
      },
      {
        name: 'green',
        message: 'color green'
      },
      {
        name: 'cyan',
        message: 'color cyan'
      },
      {
        name: 'yellow',
        message: 'color yellow'
      }
    ] as Enquirer.prompt.SortQuestion.Choice[]
  }
  it('prompt with mininum option', () => {
    const { prompt } = Enquirer

    testType(() => prompt(defaultSortQuestion))
  })

  it('with margin as an number', async () => {
    const { prompt } = Enquirer

    testType(() => prompt({
      ...defaultSortQuestion,
      margin: 2
    }))
  });

  it('with margin array', async () => {
    const { prompt } = Enquirer

    testType(() => prompt({
      ...defaultSortQuestion,
      margin: [1, 2, 3, 4]
    }))
  });

  it('skip will skip the prompt', async () => {
    await testSortPromptQuestionType({
      ...defaultSortQuestion,
      skip: true
    })
  })

  it('skip with function', async () => {
    await testSortPromptQuestionType({
      ...defaultSortQuestion,
      skip: () => true
    })
  })

  it('skip with async function', async () => {
    await testSortPromptQuestionType({
      ...defaultSortQuestion,
      skip: () => Promise.resolve(true)
    })
  })

  it('skip with delayed async function', async () => {
    await testSortPromptQuestionType({
      ...defaultSortQuestion,
      skip: () => new Promise(a => setImmediate(() => a(true)))
    })
  })

  it.skip('choice can be promise', async () => {
    await testSortPromptQuestionType({
      ...defaultSortQuestion,
      choices: [Promise.resolve({
        name: 'interface',
        message: 'The website has a friendly interface.'
      }), ...defaultSortQuestion.choices.slice(1)],
      show: false
    })
  });

  it.skip('choice can be () => ChoiceOptions', async () => {
    await testSortPromptQuestionType({
      ...defaultSortQuestion,
      choices: [() => ({
        name: 'interface',
        message: 'The website has a friendly interface.'
      }), ...defaultSortQuestion.choices.slice(1)],
      show: false
    })
  });

  it.skip('choice can be () => Promise<ChoiceOptions>', async () => {
    await testSortPromptQuestionType({
      ...defaultSortQuestion,
      choices: [() => Promise.resolve({
        name: 'interface',
        message: 'The website has a friendly interface.'
      }), ...defaultSortQuestion.choices.slice(1)],
      show: false
    })
  });

  it('with numbered flag', async () => {
    await testSortPromptQuestionType({
      ...defaultSortQuestion,
      numbered: true,
      show: false
    })
  });

  it('with hint', async () => {
    await testSortPromptQuestionType({
      ...defaultSortQuestion,
      hint: 'order up and down',
      show: false
    })
  });

  it('specify initial value (cannot validate as initial only affects ui)', async () => {
    await testSortPromptQuestionType({
      ...defaultSortQuestion,
      initial: 1,
      show: false
    })
  })

  it('initial with function (cannot validate as initial only affects ui)', async () => {
    await testSortPromptQuestionType({
      ...defaultSortQuestion,
      initial: () => 1,
      show: false,
    })
  })

  it('initial with async function (cannot validate as initial only affects ui)', async () => {
    await testSortPromptQuestionType({
      ...defaultSortQuestion,
      initial: () => Promise.resolve(1),
      show: false,
    })
  })

  it('specify format function', async () => {
    await testSortPromptQuestionType({
      ...defaultSortQuestion,
      format(value) {
        assertType<string[] | undefined>(value)
        return value ? Object.values(value).join(', ') : ''
      },
      show: false,
    })
  });

  it('specify format async function', async () => {
    await testSortPromptQuestionType({
      ...defaultSortQuestion,
      async format(value) {
        assertType<string[] | undefined>(value)
        return value ? Object.values(value).join(', ') : ''
      },
      show: false,
    })
  });

  it(`format function receives Prompt as 'this'`, async () => {
    await testSortPromptQuestionType({
      ...defaultSortQuestion,
      async format(value) {
        assertType<Prompt<string[]>>(this)
        return value ? Object.values(value).join(', ') : ''
      },
      show: false,
    })
  });

  async function testSortPromptQuestionType(question: Enquirer.prompt.SortQuestion) {
    const { prompt } = Enquirer
    prompt.on('prompt', (prompt: any) => prompt.submit())

    const answer = await prompt(question)

    const expectedAnswer = []
    for (let i = 0; i < question.choices.length; i++) {
      const c = question.choices[i]
      if (typeof c === 'function') {
        expectedAnswer.push((await c()).name)
      }
      else if (isPromise(c)) {
        expectedAnswer.push((await c).name)
      }
      else {
        expectedAnswer.push(c.name)
      }
    }

    assert.deepEqual(answer, {
      [question.name]: expectedAnswer
    })
  }
});

describe('snippet prompt', () => {
  const defaultSnippetQuestion = {
    type: 'snippet' as const,
    name: 'username',
    message: 'Fill out the fields in package.json',
    template: `{
    "name": "\${name}",
    "description": "\${description}",
    "version": "\${version}",
    "homepage": "https://github.com/\${username}/\${name}",
    "author": "\${author_name} (https://github.com/\${username})",
    "repository": "\${username}/\${name}",
    "license": "\${license:ISC}"
  }
  `,
  }
  it('prompt with mininum option', () => {
    const { prompt } = Enquirer
    testType(() => prompt(defaultSnippetQuestion))
  })

  it.skip('skip will skip the prompt', async () => {
    await testSnippetPromptQuestionType({
      ...defaultSnippetQuestion,
      skip: true
    })
  })

  it.skip('skip with function', async () => {
    await testSnippetPromptQuestionType({
      ...defaultSnippetQuestion,
      skip: () => true
    })
  })

  it.skip('skip with async function', async () => {
    await testSnippetPromptQuestionType({
      ...defaultSnippetQuestion,
      skip: () => Promise.resolve(true)
    })
  });

  it.skip('skip with delayed async function', async () => {
    await testSnippetPromptQuestionType({
      ...defaultSnippetQuestion,
      skip: () => new Promise(a => setImmediate(() => a(true)))
    })
  });

  it('specify values are required', () => {
    const { prompt } = Enquirer
    testType(() => prompt({
      ...defaultSnippetQuestion,
      required: true
    }))
  });

  it('field with name only', async () => {
    await testSnippetPromptQuestionType({
      ...defaultSnippetQuestion,
      fields: [{
        name: 'author_name'
      }],
      show: false
    })
  });

  it('field with name and message', async () => {
    await testSnippetPromptQuestionType({
      ...defaultSnippetQuestion,
      fields: [{
        name: 'author_name',
        message: 'Author Name'
      }],
      show: false
    })
  });

  it('field with initial', async () => {
    await testSnippetPromptQuestionType({
      ...defaultSnippetQuestion,
      fields: [{
        name: 'author_name',
        initial: 'User'
      }],
      show: false
    }, { 'author_name': 'User' })
  });

  it('field with validate function', async () => {
    await testSnippetPromptQuestionType({
      ...defaultSnippetQuestion,
      fields: [{
        name: 'author_name',
        validate(value) {
          assertType.isString(value)
          return true
        }
      }],
      show: false
    })
  });

  it('field with validate async function', async () => {
    await testSnippetPromptQuestionType({
      ...defaultSnippetQuestion,
      fields: [{
        name: 'author_name',
        async validate(value) {
          assertType.isString(value)
          return true
        }
      }],
      show: false
    })
  });

  it('specify format function', async () => {
    await testSnippetPromptQuestionType({
      ...defaultSnippetQuestion,
      format(value) {
        assertType<Enquirer.prompt.SnippetQuestion.Answer | undefined>(value)
        return value ? Object.values(value).join(', ') : ''
      },
      show: false,
    })
  });

  it('specify format async function', async () => {
    await testSnippetPromptQuestionType({
      ...defaultSnippetQuestion,
      async format(value) {
        assertType<Enquirer.prompt.SnippetQuestion.Answer | undefined>(value)
        return value ? Object.values(value).join(', ') : ''
      },
      show: false,
    })
  });

  it(`format function receives Prompt as 'this'`, async () => {
    await testSnippetPromptQuestionType({
      ...defaultSnippetQuestion,
      async format(value) {
        assertType<Prompt<Enquirer.prompt.SnippetQuestion.Answer>>(this)
        return value ? Object.values(value).join(', ') : ''
      },
      show: false,
    })
  });

  it.skip('specify validate function () => string', async () => {
    await testSnippetPromptQuestionType({
      ...defaultSnippetQuestion,
      validate(value) {
        assertType<Enquirer.prompt.SnippetQuestion.Answer>(value)
        return ''
      },
      show: false,
    })
  })

  it.skip('specify validate function async () => string', async () => {
    await testSnippetPromptQuestionType({
      ...defaultSnippetQuestion,
      async validate(value) {
        assertType<Enquirer.prompt.SnippetQuestion.Answer>(value)
        return ''
      },
      show: false,
    })
  })

  it('specify validate with boolean function', async () => {
    await testSnippetPromptQuestionType({
      ...defaultSnippetQuestion,
      validate(value) {
        assertType<Enquirer.prompt.SnippetQuestion.Answer>(value)
        return true
      },
      show: false,
    })
  })

  it('specify validate async boolean function', async () => {
    await testSnippetPromptQuestionType({
      ...defaultSnippetQuestion,
      async validate(value) {
        assertType<Enquirer.prompt.SnippetQuestion.Answer>(value)
        return true
      },
      show: false,
    })
  })

  it(`validate function receives Prompt as 'this'`, async () => {
    await testSnippetPromptQuestionType({
      ...defaultSnippetQuestion,
      async validate(value) {
        assertType<Prompt<Enquirer.prompt.SnippetQuestion.Answer>>(this)
        assert(this instanceof Enquirer.Prompt)
        return true
      },
      show: false,
    })
  })

  async function testSnippetPromptQuestionType(question: Enquirer.prompt.SnippetQuestion, expectedAnswer: any = undefined) {
    const { prompt } = Enquirer
    prompt.on('prompt', (prompt: any) => prompt.submit())

    const answer = await prompt(question)

    const values = {
      name: undefined,
      description: undefined,
      version: undefined,
      username: undefined,
      author_name: undefined,
      license: 'ISC',
      ...expectedAnswer
    }

    const result = `{
    "name": "${values.name}",
    "description": "${values.description}",
    "version": "${values.version}",
    "homepage": "https://github.com/${values.username}/${values.name}",
    "author": "${values.author_name} (https://github.com/${values.username})",
    "repository": "${values.username}/${values.name}",
    "license": "${values.license}"
  }
  `

    assert.deepEqual(answer, {
      [question.name]: {
        values,
        result
      }
    })
  }
});

describe('list prompt', () => {
  const minimumQuestion = {
    type: 'list' as const,
    name: 'keywords',
    message: 'Type comma-separated keywords'
  }

  async function testQuestionType(question: Enquirer.prompt.ListQuestion, expectedAnswer: string[] = []) {
    const { prompt } = Enquirer
    prompt.on('prompt', (prompt: any) => prompt.submit())

    const answer = await prompt(question)

    assert.deepEqual(answer, {
      [question.name]: expectedAnswer
    })
  }

  it('prompt with mininum option', () => {
    const { prompt } = Enquirer
    testType(() => prompt(minimumQuestion))
  })

  it.skip('skip will skip the prompt', async () => {
    await testQuestionType({
      ...minimumQuestion,
      skip: true
    })
  })

  it.skip('skip with function', async () => {
    await testQuestionType({
      ...minimumQuestion,
      skip: () => true
    })
  })

  it.skip('skip with async function', async () => {
    await testQuestionType({
      ...minimumQuestion,
      skip: () => Promise.resolve(true)
    })
  })

  it('skip with delayed async function', async () => {
    await testQuestionType({
      ...minimumQuestion,
      skip: () => new Promise(a => setImmediate(() => a(true)))
    })
  })

  it.skip('specify separator (to be improved)', async () => {
    await testQuestionType({
      ...minimumQuestion,
      separator: ':',
    })
  })

  it('specify initial string value', async () => {
    await testQuestionType({
      ...minimumQuestion,
      initial: 'blue',
      show: false
    }, ['blue'])
  })

  it('specify initial string[] value', async () => {
    await testQuestionType({
      ...minimumQuestion,
      initial: ['blue', 'green'],
      show: false
    }, ['blue', 'green'])
  })

  it.skip('initial with function () => string', async () => {
    await testQuestionType({
      ...minimumQuestion,
      initial: () => 'blue',
      show: false
    }, ['blue'])
  })

  it.skip('initial with function () => string[]', async () => {
    await testQuestionType({
      ...minimumQuestion,
      initial: () => ['blue', 'green'],
      show: false
    }, ['blue', 'green'])
  })

  it.skip('initial with async function () => string', async () => {
    await testQuestionType({
      ...minimumQuestion,
      initial: () => Promise.resolve('blue'),
      show: false
    }, ['blue'])
  })

  it.skip('initial with async function () => string[]', async () => {
    await testQuestionType({
      ...minimumQuestion,
      initial: () => Promise.resolve(['blue', 'green']),
      show: false
    }, ['blue', 'green'])
  })

  it.skip('initial with delayed async function', async () => {
    await testQuestionType({
      ...minimumQuestion,
      initial: () => new Promise(a => setImmediate(() => a('blue'))),
      show: false
    }, ['blue'])
  })

  it('specify format function', async () => {
    let called = false
    await testQuestionType({
      ...minimumQuestion,
      format(value) {
        called = true
        assertType.isString(value)
        return value
      },
      show: false,
    })
    assert.ok(called)
  })

  it('specify format async function', async () => {
    await testQuestionType({
      ...minimumQuestion,
      format(value) {
        assertType.isString(value)
        return Promise.resolve(value)
      },
      show: false,
    })
  })

  it(`format function receives Prompt as 'this'`, async () => {
    await testQuestionType({
      ...minimumQuestion,
      format(value) {
        assertType<Prompt<string[]>>(this)
        return value
      },
      show: false,
    })
  })

  it.skip('specify validate function', async () => {
    await testQuestionType({
      ...minimumQuestion,
      validate(value) {
        assertType<string[]>(value)
        return ''
      },
      show: false,
    })
  })

  it('specify validate with boolean function', async () => {
    await testQuestionType({
      ...minimumQuestion,
      validate(value) {
        assertType<string[]>(value)
        return true
      },
      show: false,
    })
  })

  it('specify validate async boolean function', async () => {
    await testQuestionType({
      ...minimumQuestion,
      async validate(value) {
        assertType<string[]>(value)
        return true
      },
      show: false,
    })
  })

  it(`validate function receives Prompt as 'this'`, async () => {
    await testQuestionType({
      ...minimumQuestion,
      validate() {
        assertType<Prompt<string[]>>(this)
        assert(this instanceof Enquirer.Prompt)
        return true
      },
      show: false,
    })
  })

  it('specify result function', async () => {
    await testQuestionType({
      ...minimumQuestion,
      result(value) {
        assertType<string[]>(value)
        return value
      },
      show: false,
    })
  })

  it('specify result async function', async () => {
    await testQuestionType({
      ...minimumQuestion,
      async result(value) {
        assertType<string[]>(value)
        return value
      },
      show: false,
    })
  })

  it(`result function receives Prompt as 'this'`, async () => {
    await testQuestionType({
      ...minimumQuestion,
      result(value) {
        assertType<Prompt<string[]>>(this)
        assert(this instanceof Enquirer.Prompt)
        return value
      },
      show: false,
    })
  })
});

describe('select prompt', () => {
  const minimumQuestion = {
    type: 'select' as const,
    name: 'color',
    message: 'Pick a flavor',
    choices: ['apple', 'grape', 'watermelon', 'cherry', 'orange']
  }

  async function testQuestionType(
    question: Enquirer.prompt.SelectQuestion,
    expectedAnswer: string = 'apple'
  ) {
    const { prompt } = Enquirer
    prompt.on('prompt', (prompt: any) => prompt.submit())

    const answer = await prompt(question)

    assert.deepEqual(answer, {
      [question.name]: expectedAnswer
    })
  }

  it('prompt with mininum option', () => {
    const { prompt } = Enquirer
    testType(() => prompt(minimumQuestion))
  })

  it.skip('skip will skip the prompt', async () => {
    await testQuestionType({
      ...minimumQuestion,
      skip: true
    })
  })

  it.skip('skip with function', async () => {
    await testQuestionType({
      ...minimumQuestion,
      skip: () => true
    })
  })

  it.skip('skip with async function', async () => {
    await testQuestionType({
      ...minimumQuestion,
      skip: () => Promise.resolve(true)
    })
  })

  it.skip('skip with delayed async function', async () => {
    await testQuestionType({
      ...minimumQuestion,
      skip: () => new Promise(a => setImmediate(() => a(true)))
    })
  })

  it.skip('choice can be promise', async () => {
    await testQuestionType({
      ...minimumQuestion,
      choices: [Promise.resolve('apple'), 'grape', 'watermelon', 'cherry', 'orange'],
      show: false
    })
  });

  it.skip('choice can be () => string', async () => {
    await testQuestionType({
      ...minimumQuestion,
      choices: [() => 'apple', 'grape', 'watermelon', 'cherry', 'orange'],
      show: false
    })
  });

  it.skip('choice can be () => Promise<string>', async () => {
    await testQuestionType({
      ...minimumQuestion,
      choices: [async () => 'apple', 'grape', 'watermelon', 'cherry', 'orange'],
      show: false
    })
  });

  it.skip('choice can be choice options', async () => {
    await testQuestionType({
      ...minimumQuestion,
      choices: [
        { name: 'apple' },
        { name: 'apple2', message: 'APPLE' },
        { name: 'watermelon', hint: 'choose this' },
        { name: 'apple4', disabled: false },
        { name: 'apple5', disabled: true },
        { name: 'orange1', message: 'a1', hint: 'not ripe' },
        { name: 'orange2', hint: 'not ripe', disabled: true },
        { name: 'orange3', message: 'Orange3', disabled: true },
        { name: 'orange4', message: 'Orange4', hint: 'not ripe', disabled: true },
      ],
      show: false
    })
  });

  it.skip('choice can be () => ChoiceOption', async () => {
    await testQuestionType({
      ...minimumQuestion,
      choices: [() => ({ name: 'apple' }), 'grape', 'watermelon', 'cherry', 'orange'],
      show: false
    })
  });

  it.skip('choice can be () => Promise<ChoiceOption>', async () => {
    await testQuestionType({
      ...minimumQuestion,
      choices: [async () => ({ name: 'apple' }), 'grape', 'watermelon', 'cherry', 'orange'],
      show: false
    })
  });

  it.skip('specify initial string value', async () => {
    await testQuestionType({
      ...minimumQuestion,
      initial: 'cherry',
      show: false
    }, 'cherry')
  })

  it.skip('specify initial number (index) value', async () => {
    await testQuestionType({
      ...minimumQuestion,
      initial: 3,
      show: false
    }, 'cherry')
  })

  it.skip('initial with function () => string', async () => {
    await testQuestionType({
      ...minimumQuestion,
      initial: () => 'cherry',
      show: false
    })
  })

  it.skip('initial with async function () => string', async () => {
    await testQuestionType({
      ...minimumQuestion,
      initial: () => Promise.resolve('cherry'),
      show: false
    })
  })

  it.skip('initial with delayed async function', async () => {
    await testQuestionType({
      ...minimumQuestion,
      initial: () => new Promise(a => setImmediate(() => a('cherry'))),
      show: false
    })
  })

  it.skip('specify format function', async () => {
    let called = false
    await testQuestionType({
      ...minimumQuestion,
      format(value) {
        called = true
        assertType.isString(value)
        return value
      },
      show: false,
    })
    assert.ok(called)
  })

  it.skip('specify format async function', async () => {
    await testQuestionType({
      ...minimumQuestion,
      format(value) {
        assertType.isString(value)
        return Promise.resolve(value)
      },
      show: false,
    })
  })

  it.skip(`format function receives Prompt as 'this'`, async () => {
    await testQuestionType({
      ...minimumQuestion,
      format(value) {
        assertType<Prompt<string>>(this)
        return value
      },
      show: false,
    })
  })
});

describe('multiselect prompt', () => {
  const minimumQuestion = {
    type: 'multiselect' as const,
    name: 'value',
    message: 'Pick your favorite colors',
    choices: [
      { name: 'aqua', value: '#00ffff' },
      { name: 'black', value: '#000000' },
      { name: 'blue', value: '#0000ff' },
      { name: 'fuchsia', value: '#ff00ff' },
      { name: 'gray', value: '#808080' },
      { name: 'green', value: '#008000' },
      { name: 'lime', value: '#00ff00' },
      { name: 'maroon', value: '#800000' },
      { name: 'navy', value: '#000080' },
      { name: 'olive', value: '#808000' },
      { name: 'purple', value: '#800080' },
      { name: 'red', value: '#ff0000' },
      { name: 'silver', value: '#c0c0c0' },
      { name: 'teal', value: '#008080' },
      { name: 'white', value: '#ffffff' },
      { name: 'yellow', value: '#ffff00' }
    ]
  }

  async function testQuestionType(
    question: Enquirer.prompt.MultiSelectQuestion,
    expectedAnswer: string[] = []
  ) {
    const { prompt } = Enquirer
    prompt.on('prompt', (prompt: any) => prompt.submit())

    const answer = await prompt(question)

    assert.deepEqual(answer, {
      [question.name]: expectedAnswer
    })
  }

  it('prompt with mininum option', () => {
    const { prompt } = Enquirer
    testType(() => prompt(minimumQuestion))
  })

  it.skip('skip will skip the prompt', async () => {
    await testQuestionType({
      ...minimumQuestion,
      skip: true
    })
  })

  it.skip('skip with function', async () => {
    await testQuestionType({
      ...minimumQuestion,
      skip: () => true
    })
  })

  it.skip('skip with async function', async () => {
    await testQuestionType({
      ...minimumQuestion,
      skip: () => Promise.resolve(true)
    })
  })

  it.skip('skip with delayed async function', async () => {
    await testQuestionType({
      ...minimumQuestion,
      skip: () => new Promise(a => setImmediate(() => a(true)))
    })
  })

  it.skip('choice can be promise', async () => {
    await testQuestionType({
      ...minimumQuestion,
      choices: [Promise.resolve('apple'), 'grape', 'watermelon', 'cherry', 'orange'],
      show: false
    })
  });

  it.skip('choice can be () => string', async () => {
    await testQuestionType({
      ...minimumQuestion,
      choices: [() => 'apple', 'grape', 'watermelon', 'cherry', 'orange'],
      show: false
    })
  });

  it.skip('choice can be () => Promise<string>', async () => {
    await testQuestionType({
      ...minimumQuestion,
      choices: [async () => 'apple', 'grape', 'watermelon', 'cherry', 'orange'],
      show: false
    })
  });

  it.skip('choice can be choice options', async () => {
    await testQuestionType({
      ...minimumQuestion,
      choices: [
        { name: 'apple' },
        { name: 'apple2', message: 'APPLE' },
        { name: 'watermelon', hint: 'choose this' },
        { name: 'apple4', disabled: false },
        { name: 'apple5', disabled: true },
        { name: 'orange1', message: 'a1', hint: 'not ripe' },
        { name: 'orange2', hint: 'not ripe', disabled: true },
        { name: 'orange3', message: 'Orange3', disabled: true },
        { name: 'orange4', message: 'Orange4', hint: 'not ripe', disabled: true },
      ],
      show: false
    })
  });

  it.skip('choice can be () => ChoiceOption', async () => {
    await testQuestionType({
      ...minimumQuestion,
      choices: [() => ({ name: 'apple' }), 'grape', 'watermelon', 'cherry', 'orange'],
      show: false
    })
  });

  it.skip('choice can be () => Promise<ChoiceOption>', async () => {
    await testQuestionType({
      ...minimumQuestion,
      choices: [async () => ({ name: 'apple' }), 'grape', 'watermelon', 'cherry', 'orange'],
      show: false
    })
  });

  it.skip('specify limit', async () => {
    await testQuestionType({
      ...minimumQuestion,
      limit: 3,
      show: false
    })
  })

  it.skip('specify initial string value', async () => {
    await testQuestionType({
      ...minimumQuestion,
      initial: 'black',
      show: false
    }, ['black'])
  })

  it.skip('initial with function () => string', async () => {
    await testQuestionType({
      ...minimumQuestion,
      initial: () => 'black',
      show: false
    }, ['black'])
  })

  it.skip('initial with async function () => Promise<string>', async () => {
    await testQuestionType({
      ...minimumQuestion,
      initial: async () => 'black',
      show: false
    }, ['black'])
  })

  it.skip('initial with delayed async function', async () => {
    await testQuestionType({
      ...minimumQuestion,
      initial: () => new Promise(a => setImmediate(() => a('black'))),
      show: false
    }, ['black'])
  })

  it.skip('specify initial string[] value', async () => {
    await testQuestionType({
      ...minimumQuestion,
      initial: ['black', 'navy'],
      show: false
    }, ['black', 'navy'])
  })

  it.skip('initial with function () => string', async () => {
    await testQuestionType({
      ...minimumQuestion,
      initial: () => ['black', 'navy'],
      show: false
    }, ['black', 'navy'])
  })

  it.skip('initial with async function () => Promise<string>', async () => {
    await testQuestionType({
      ...minimumQuestion,
      initial: async () => ['black', 'navy'],
      show: false
    }, ['black', 'navy'])
  })

  it.skip('initial with delayed async function', async () => {
    await testQuestionType({
      ...minimumQuestion,
      initial: () => new Promise(a => setImmediate(() => a(['black', 'navy']))),
      show: false
    }, ['black', 'navy'])
  })

  it.skip('specify format function', async () => {
    let called = false
    await testQuestionType({
      ...minimumQuestion,
      format(value) {
        called = true
        assertType<string[]>(value)
        return 'string'
      },
      show: false,
    })
    assert.ok(called)
  })

  it.skip('specify format async function', async () => {
    await testQuestionType({
      ...minimumQuestion,
      format(value) {
        assertType<string[]>(value)
        return Promise.resolve('string')
      },
      show: false,
    })
  })

  it.skip(`format function receives Prompt as 'this'`, async () => {
    await testQuestionType({
      ...minimumQuestion,
      format(value) {
        assertType<Prompt<string[]>>(this)
        return 'string'
      },
      show: false,
    })
  })
});

describe('form prompt', () => {
  const minimumQuestion = {
    type: 'form' as const,
    name: 'user',
    message: 'Please provide the following information:',
    choices: [
      { name: 'firstname', message: 'First Name' },
      { name: 'lastname', message: 'Last Name' },
      { name: 'username', message: 'GitHub username' }
    ]
  }

  async function testQuestionType(
    question: Enquirer.prompt.FormQuestion,
    expectedAnswer: Enquirer.prompt.FormQuestion.Answer = {}
  ) {
    const { prompt } = Enquirer
    prompt.on('prompt', (prompt: any) => prompt.submit())

    const answer = await prompt(question)

    assert.deepEqual(answer, {
      [question.name]: expectedAnswer
    })
  }

  it('prompt with mininum option', () => {
    const { prompt } = Enquirer
    testType(() => prompt(minimumQuestion))
  })

  it.skip('skip will skip the prompt', async () => {
    await testQuestionType({
      ...minimumQuestion,
      skip: true
    })
  })

  it.skip('skip with function', async () => {
    await testQuestionType({
      ...minimumQuestion,
      skip: () => true
    })
  })

  it.skip('skip with async function', async () => {
    await testQuestionType({
      ...minimumQuestion,
      skip: () => Promise.resolve(true)
    })
  })

  it.skip('skip with delayed async function', async () => {
    await testQuestionType({
      ...minimumQuestion,
      skip: () => new Promise(a => setImmediate(() => a(true)))
    })
  })

  it.skip('choice option supports optional hint, initial, and disabled property', async () => {
    await testQuestionType({
      ...minimumQuestion,
      choices: [
        { name: 'firstname', message: 'First Name', initial: 'Jon', hint: 'name' },
        { name: 'lastname', message: 'Last Name', initial: 'Schlinkert', disabled: true },
        { name: 'username', message: 'GitHub username', initial: 'jonschlinkert' }
      ],
      show: false
    })
  });

  it.skip('choice can be promise', async () => {
    await testQuestionType({
      ...minimumQuestion,
      choices: [
        Promise.resolve({ name: 'firstname', message: 'First Name', initial: 'Jon' }),
        { name: 'lastname', message: 'Last Name', initial: 'Schlinkert' },
        { name: 'username', message: 'GitHub username', initial: 'jonschlinkert' }
      ],
      show: false
    })
  });

  it.skip('choice can be () => ChoiceOption', async () => {
    await testQuestionType({
      ...minimumQuestion,
      choices: [
        () => ({ name: 'firstname', message: 'First Name', initial: 'Jon' }),
        { name: 'lastname', message: 'Last Name', initial: 'Schlinkert' },
        { name: 'username', message: 'GitHub username', initial: 'jonschlinkert' }
      ],
      show: false
    })
  });

  it.skip('choice can be () => Promise<ChoiceOption>', async () => {
    await testQuestionType({
      ...minimumQuestion,
      choices: [
        () => Promise.resolve({ name: 'firstname', message: 'First Name', initial: 'Jon' }),
        { name: 'lastname', message: 'Last Name', initial: 'Schlinkert' },
        { name: 'username', message: 'GitHub username', initial: 'jonschlinkert' }
      ],
      show: false
    })
  });

  it.skip('specify align left', async () => {
    await testQuestionType({
      ...minimumQuestion,
      align: 'left'
    })
  })

  it.skip('specify align right', async () => {
    await testQuestionType({
      ...minimumQuestion,
      align: 'right'
    })
  })

  it.skip('specify validate function', async () => {
    await testQuestionType({
      ...minimumQuestion,
      validate(value) {
        assertType<Record<string, string>>(value)
        return ''
      },
      show: false
    })
  })

  it('specify validate with boolean function', async () => {
    await testQuestionType({
      ...minimumQuestion,
      validate(value) {
        assertType<Record<string, string>>(value)
        return true
      },
      show: false
    })
  })

  it('specify validate async boolean function', async () => {
    await testQuestionType({
      ...minimumQuestion,
      async validate(value) {
        assertType<Record<string, string>>(value)
        return true
      },
      show: false
    })
  })

  it(`validate function receives Prompt as 'this'`, async () => {
    await testQuestionType({
      ...minimumQuestion,
      validate(value) {
        assertType<Prompt<Record<string, string>>>(this)
        assert(this instanceof Enquirer.Prompt)
        return true
      },
      show: false
    })
  })

  it('specify result function', async () => {
    await testQuestionType({
      ...minimumQuestion,
      result(value) {
        assertType<Enquirer.prompt.FormQuestion.Answer>(value)
        return value
      },
      show: false
    })
  })

  it('specify result async function', async () => {
    await testQuestionType({
      ...minimumQuestion,
      async result(value) {
        assertType<Enquirer.prompt.FormQuestion.Answer>(value)
        return value
      },
      show: false
    })
  })

  it(`result function receives Prompt as 'this'`, async () => {
    await testQuestionType({
      ...minimumQuestion,
      result(value) {
        assertType<Enquirer.prompt.FormQuestion.Answer>(value)
        assertType<Prompt<Enquirer.prompt.FormQuestion.Answer>>(this)
        assert(this instanceof Enquirer.Prompt)
        return value
      },
      show: false
    })
  })
});

// AutoComplete Prompt
// Editable Prompt

function isPromise(c: any): c is Promise<any> {
  return typeof c.then === 'function'
}
