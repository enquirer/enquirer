import assert from 'assert'
import { assertType } from 'type-plus'
import Enquirer, { Prompt } from '..'
import { testType } from './support'

const { prompt } = Enquirer

describe('input prompt', () => {
  it('prompt with mininum option', () => {
    testType(() => prompt({
      type: 'input',
      name: 'color',
      message: 'Favorite color?',
    }))
  })

  it('skip will skip the prompt', async () => {
    const answer = await prompt({
      type: 'input',
      name: 'color',
      message: 'Favorite color?',
      skip: true
    })

    assert.deepEqual(answer, { color: '' })
  })

  it('skip with function', async () => {
    const answer = await prompt({
      type: 'input',
      name: 'color',
      message: 'Favorite color?',
      skip: () => true
    })

    assert.deepEqual(answer, { color: '' })
  })

  it('skip with async function', async () => {
    const answer = await prompt({
      type: 'input',
      name: 'color',
      message: 'Favorite color?',
      skip: () => Promise.resolve(true)
    })

    assert.deepEqual(answer, { color: '' })
  })

  it('skip with delayed async function', async () => {
    const answer = await prompt({
      type: 'input',
      name: 'color',
      message: 'Favorite color?',
      skip: () => new Promise(a => setImmediate(() => a(true)))
    })

    assert.deepEqual(answer, { color: '' })
  })

  it('specify initial value', async () => {
    const answer = await prompt({
      type: 'input',
      name: 'color',
      message: 'Favorite color?',
      skip: true,
      initial: 'blue'
    })

    assert.deepEqual(answer, { color: 'blue' })
  })

  it.skip('initial with function', async () => {
    const answer = await prompt({
      type: 'input',
      name: 'color',
      message: 'Favorite color?',
      skip: true,
      initial: () => 'blue'
    })

    assert.deepEqual(answer, { color: 'blue' })
  })

  it.skip('initial with async function', async () => {
    const answer = await prompt({
      type: 'input',
      name: 'color',
      message: 'Favorite color?',
      skip: true,
      initial: () => Promise.resolve('blue')
    })

    assert.deepEqual(answer, { color: 'blue' })
  })

  it.skip('initial with async function', async () => {
    const answer = await prompt({
      type: 'input',
      name: 'color',
      message: 'Favorite color?',
      skip: true,
      initial: () => new Promise(a => setImmediate(() => a('blue')))
    })

    assert.deepEqual(answer, { color: 'blue' })
  })

  it('specify format function', async () => {
    const answer = await prompt({
      type: 'input',
      name: 'color',
      message: 'Favorite color?',
      skip: true,
      initial: 'blue',
      format(value) {
        assertType.isString(value)
        return value
      }
    })

    assert.deepEqual(answer, { color: 'blue' })
  })

  it('specify format async function', async () => {
    const answer = await prompt({
      type: 'input',
      name: 'color',
      message: 'Favorite color?',
      skip: true,
      initial: 'blue',
      format(value) {
        assertType.isString(value)
        return Promise.resolve(value)
      }
    })

    assert.deepEqual(answer, { color: 'blue' })
  })

  it(`format function receives Prompt as 'this'`, async () => {
    const answer = await prompt({
      type: 'input',
      name: 'color',
      message: 'Favorite color?',
      skip: true,
      initial: 'blue',
      format(value) {
        assertType<Prompt<string>>(this)
        return value
      }
    })

    assert.deepEqual(answer, { color: 'blue' })
  })

  it('specify result function', async () => {
    const answer = await prompt({
      type: 'input',
      name: 'color',
      message: 'Favorite color?',
      skip: true,
      initial: 'blue',
      result(value) {
        assertType.isString(value)
        return value + 'r'
      }
    })

    assert.deepEqual(answer, { color: 'bluer' })
  })

  it('specify result async function', async () => {
    const answer = await prompt({
      type: 'input',
      name: 'color',
      message: 'Favorite color?',
      skip: true,
      initial: 'blue',
      result(value) {
        assertType.isString(value)
        return Promise.resolve(value + 'r')
      }
    })

    assert.deepEqual(answer, { color: 'bluer' })
  })

  it(`result function receives Prompt as 'this'`, async () => {
    const answer = await prompt({
      type: 'input',
      name: 'color',
      message: 'Favorite color?',
      skip: true,
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
    const answer = await prompt({
      type: 'input',
      name: 'color',
      message: 'Favorite color?',
      skip: true,
      initial: 'blue',
      validate(value) {
        assertType.isString(value)
        return ''
      }
    })

    assert.deepEqual(answer, { color: 'bluer' })
  })

  it('specify validate with boolean function', async () => {
    const answer = await prompt({
      type: 'input',
      name: 'color',
      message: 'Favorite color?',
      skip: true,
      initial: 'blue',
      validate(value) {
        assertType.isString(value)
        return true
      }
    })

    assert.deepEqual(answer, { color: 'blue' })
  })

  it('specify validate async boolean function', async () => {
    const answer = await prompt({
      type: 'input',
      name: 'color',
      message: 'Favorite color?',
      skip: true,
      initial: 'blue',
      validate(value) {
        assertType.isString(value)
        return Promise.resolve(true)
      }
    })

    assert.deepEqual(answer, { color: 'blue' })
  })

  it(`validate function receives Prompt as 'this'`, async () => {
    const answer = await prompt({
      type: 'input',
      name: 'color',
      message: 'Favorite color?',
      skip: true,
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
    testType(() => prompt({
      type: 'confirm',
      name: 'question',
      message: 'Want to answer?',
    }))
  })

  it('skip will skip the prompt', async () => {
    const answer = await prompt({
      type: 'confirm',
      name: 'question',
      message: 'Want to answer?',
      skip: true
    })

    assert.deepEqual(answer, { question: false })
  })

  it('skip with function', async () => {
    const answer = await prompt({
      type: 'confirm',
      name: 'question',
      message: 'Want to answer?',
      skip: () => true
    })

    assert.deepEqual(answer, { question: false })
  })

  it('skip with async function', async () => {
    const answer = await prompt({
      type: 'confirm',
      name: 'question',
      message: 'Want to answer?',
      skip: () => Promise.resolve(true)
    })

    assert.deepEqual(answer, { question: false })
  })

  it('skip with delayed async function', async () => {
    const answer = await prompt({
      type: 'confirm',
      name: 'question',
      message: 'Want to answer?',
      skip: () => new Promise(a => setImmediate(() => a(true)))
    })

    assert.deepEqual(answer, { question: false })
  })

  it('specify initial value', async () => {
    const answer = await prompt({
      type: 'confirm',
      name: 'question',
      message: 'Want to answer?',
      skip: true,
      initial: true
    })

    assert.deepEqual(answer, { question: true })
  })

  it.skip('initial with function', async () => {
    const answer = await prompt({
      type: 'confirm',
      name: 'question',
      message: 'Want to answer?',
      skip: true,
      initial: () => true
    })

    assert.deepEqual(answer, { question: true })
  })

  it.skip('initial with async function', async () => {
    const answer = await prompt({
      type: 'confirm',
      name: 'question',
      message: 'Want to answer?',
      skip: true,
      initial: () => Promise.resolve(true)
    })

    assert.deepEqual(answer, { question: true })
  })

  it.skip('initial with async function', async () => {
    const answer = await prompt({
      type: 'confirm',
      name: 'question',
      message: 'Want to answer?',
      skip: true,
      initial: () => new Promise(a => setImmediate(() => a(true)))
    })

    assert.deepEqual(answer, { question: true })
  })

  it('specify format function', async () => {
    const answer = await prompt({
      type: 'confirm',
      name: 'question',
      message: 'Want to answer?',
      skip: true,
      initial: true,
      format(value) {
        assertType.isBoolean(value)
        return `(${value})`
      }
    })

    assert.deepEqual(answer, { question: true })
  })

  it('specify format async function', async () => {
    const answer = await prompt({
      type: 'confirm',
      name: 'question',
      message: 'Want to answer?',
      skip: true,
      initial: true,
      format(value) {
        assertType.isBoolean(value)
        return Promise.resolve(`(${value})`)
      }
    })

    assert.deepEqual(answer, { question: true })
  })

  it(`format function receives Prompt as 'this'`, async () => {
    const answer = await prompt({
      type: 'confirm',
      name: 'question',
      message: 'Want to answer?',
      skip: true,
      initial: true,
      format(value) {
        assertType<Prompt<boolean>>(this)
        return `(${value})`
      }
    })

    assert.deepEqual(answer, { question: true })
  })

  it('specify result function', async () => {
    const answer = await prompt({
      type: 'confirm',
      name: 'question',
      message: 'Want to answer?',
      skip: true,
      initial: true,
      result(value) {
        assertType.isBoolean(value)
        return value
      }
    })

    assert.deepEqual(answer, { question: true })
  })

  it('specify result async function', async () => {
    const answer = await prompt({
      type: 'confirm',
      name: 'question',
      message: 'Want to answer?',
      skip: true,
      initial: true,
      result(value) {
        assertType.isBoolean(value)
        return Promise.resolve(value)
      }
    })

    assert.deepEqual(answer, { question: true })
  })

  it(`result function receives Prompt as 'this'`, async () => {
    const answer = await prompt({
      type: 'confirm',
      name: 'question',
      message: 'Want to answer?',
      skip: true,
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
    const answer = await prompt({
      type: 'confirm',
      name: 'question',
      message: 'Want to answer?',
      skip: true,
      initial: true,
      validate(value) {
        assertType.isBoolean(value)
        return ''
      }
    })

    assert.deepEqual(answer, { question: true })
  })

  it('specify validate with boolean function', async () => {
    const answer = await prompt({
      type: 'confirm',
      name: 'question',
      message: 'Want to answer?',
      skip: true,
      initial: true,
      validate(value) {
        assertType.isBoolean(value)
        return true
      }
    })

    assert.deepEqual(answer, { question: true })
  })

  it('specify validate async boolean function', async () => {
    const answer = await prompt({
      type: 'confirm',
      name: 'question',
      message: 'Want to answer?',
      skip: true,
      initial: true,
      validate(value) {
        assertType.isBoolean(value)
        return Promise.resolve(true)
      }
    })

    assert.deepEqual(answer, { question: true })
  })

  it(`validate function receives Prompt as 'this'`, async () => {
    const answer = await prompt({
      type: 'confirm',
      name: 'question',
      message: 'Want to answer?',
      skip: true,
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
    testType(() => prompt({
      type: 'numeral',
      name: 'number',
      message: 'Please enter a number',
    }))
  })

  it('skip will skip the prompt', async () => {
    const answer = await prompt({
      type: 'numeral',
      name: 'number',
      message: 'Please enter a number',
      skip: true
    })

    assert.deepEqual(answer, { number: 0 })
  })

  it('skip with function', async () => {
    const answer = await prompt({
      type: 'numeral',
      name: 'number',
      message: 'Please enter a number',
      skip: () => true
    })

    assert.deepEqual(answer, { number: 0 })
  })

  it('skip with async function', async () => {
    const answer = await prompt({
      type: 'numeral',
      name: 'number',
      message: 'Please enter a number',
      skip: () => Promise.resolve(true)
    })

    assert.deepEqual(answer, { number: 0 })
  })

  it('skip with delayed async function', async () => {
    const answer = await prompt({
      type: 'numeral',
      name: 'number',
      message: 'Please enter a number',
      skip: () => new Promise(a => setImmediate(() => a(true)))
    })

    assert.deepEqual(answer, { number: 0 })
  })

  it('specify initial value', async () => {
    const answer = await prompt({
      type: 'numeral',
      name: 'number',
      message: 'Please enter a number',
      skip: true,
      initial: 123
    })

    assert.deepEqual(answer, { number: 123 })
  })

  it.skip('initial with function', async () => {
    const answer = await prompt({
      type: 'numeral',
      name: 'number',
      message: 'Please enter a number',
      skip: true,
      initial: () => 123
    })

    assert.deepEqual(answer, { number: 123 })
  })

  it.skip('initial with async function', async () => {
    const answer = await prompt({
      type: 'numeral',
      name: 'number',
      message: 'Please enter a number',
      skip: true,
      initial: () => Promise.resolve(123)
    })

    assert.deepEqual(answer, { number: 123 })
  })

  it.skip('initial with async function', async () => {
    const answer = await prompt({
      type: 'numeral',
      name: 'number',
      message: 'Please enter a number',
      skip: true,
      initial: () => new Promise(a => setImmediate(() => a(123)))
    })

    assert.deepEqual(answer, { number: 123 })
  })

  it('specify format function', async () => {
    const answer = await prompt({
      type: 'numeral',
      name: 'number',
      message: 'Please enter a number',
      skip: true,
      initial: 123,
      format(value) {
        assertType.isNumber(value)
        return `(${value})`
      }
    })

    assert.deepEqual(answer, { number: 123 })
  })

  it('specify format async function', async () => {
    const answer = await prompt({
      type: 'numeral',
      name: 'number',
      message: 'Please enter a number',
      skip: true,
      initial: 123,
      format(value) {
        assertType.isNumber(value)
        return Promise.resolve(`(${value})`)
      }
    })

    assert.deepEqual(answer, { number: 123 })
  })

  it(`format function receives Prompt as 'this'`, async () => {
    const answer = await prompt({
      type: 'numeral',
      name: 'number',
      message: 'Please enter a number',
      skip: true,
      initial: 123,
      format(value) {
        assertType<Prompt<number>>(this)
        return `(${value})`
      }
    })

    assert.deepEqual(answer, { number: 123 })
  })

  it('specify result function', async () => {
    const answer = await prompt({
      type: 'numeral',
      name: 'number',
      message: 'Please enter a number',
      skip: true,
      initial: 123,
      result(value) {
        assertType.isNumber(value)
        return value
      }
    })

    assert.deepEqual(answer, { number: 123 })
  })

  it('specify result async function', async () => {
    const answer = await prompt({
      type: 'numeral',
      name: 'number',
      message: 'Please enter a number',
      skip: true,
      initial: 123,
      result(value) {
        assertType.isNumber(value)
        return Promise.resolve(value)
      }
    })

    assert.deepEqual(answer, { number: 123 })
  })

  it(`result function receives Prompt as 'this'`, async () => {
    const answer = await prompt({
      type: 'numeral',
      name: 'number',
      message: 'Please enter a number',
      skip: true,
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
    const answer = await prompt({
      type: 'numeral',
      name: 'number',
      message: 'Please enter a number',
      skip: true,
      initial: 123,
      validate(value) {
        assertType.isNumber(value)
        return ''
      }
    })

    assert.deepEqual(answer, { number: 123 })
  })

  it('specify validate with boolean function', async () => {
    const answer = await prompt({
      type: 'numeral',
      name: 'number',
      message: 'Please enter a number',
      skip: true,
      initial: 123,
      validate(value) {
        assertType.isNumber(value)
        return true
      }
    })

    assert.deepEqual(answer, { number: 123 })
  })

  it('specify validate async boolean function', async () => {
    const answer = await prompt({
      type: 'numeral',
      name: 'number',
      message: 'Please enter a number',
      skip: true,
      initial: 123,
      validate(value) {
        assertType.isNumber(value)
        return Promise.resolve(true)
      }
    })

    assert.deepEqual(answer, { number: 123 })
  })

  it(`validate function receives Prompt as 'this'`, async () => {
    const answer = await prompt({
      type: 'numeral',
      name: 'number',
      message: 'Please enter a number',
      skip: true,
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
    testType(() => prompt({
      type: 'password',
      name: 'password',
      message: 'What is your password?',
    }))
  })

  it('skip will skip the prompt', async () => {
    const answer = await prompt({
      type: 'password',
      name: 'password',
      message: 'What is your password?',
      skip: true
    })

    assert.deepEqual(answer, { password: '' })
  })

  it('skip with function', async () => {
    const answer = await prompt({
      type: 'password',
      name: 'password',
      message: 'What is your password?',
      skip: () => true
    })

    assert.deepEqual(answer, { password: '' })
  })

  it('skip with async function', async () => {
    const answer = await prompt({
      type: 'password',
      name: 'password',
      message: 'What is your password?',
      skip: () => Promise.resolve(true)
    })

    assert.deepEqual(answer, { password: '' })
  })

  it('skip with delayed async function', async () => {
    const answer = await prompt({
      type: 'password',
      name: 'password',
      message: 'What is your password?',
      skip: () => new Promise(a => setImmediate(() => a(true)))
    })

    assert.deepEqual(answer, { password: '' })
  })

  it('specify initial value', async () => {
    const answer = await prompt({
      type: 'password',
      name: 'password',
      message: 'What is your password?',
      skip: true,
      initial: 'blue'
    })

    assert.deepEqual(answer, { password: 'blue' })
  })

  it.skip('initial with function', async () => {
    const answer = await prompt({
      type: 'password',
      name: 'password',
      message: 'What is your password?',
      skip: true,
      initial: () => 'blue'
    })

    assert.deepEqual(answer, { password: 'blue' })
  })

  it.skip('initial with async function', async () => {
    const answer = await prompt({
      type: 'password',
      name: 'password',
      message: 'What is your password?',
      skip: true,
      initial: () => Promise.resolve('blue')
    })

    assert.deepEqual(answer, { password: 'blue' })
  })

  it.skip('initial with async function', async () => {
    const answer = await prompt({
      type: 'password',
      name: 'password',
      message: 'What is your password?',
      skip: true,
      initial: () => new Promise(a => setImmediate(() => a('blue')))
    })

    assert.deepEqual(answer, { password: 'blue' })
  })

  it('specify format function', async () => {
    const answer = await prompt({
      type: 'password',
      name: 'password',
      message: 'What is your password?',
      skip: true,
      initial: 'blue',
      format(value) {
        assertType.isString(value)
        return value
      }
    })

    assert.deepEqual(answer, { password: 'blue' })
  })

  it('specify format async function', async () => {
    const answer = await prompt({
      type: 'password',
      name: 'password',
      message: 'What is your password?',
      skip: true,
      initial: 'blue',
      format(value) {
        assertType.isString(value)
        return Promise.resolve(value)
      }
    })

    assert.deepEqual(answer, { password: 'blue' })
  })

  it(`format function receives Prompt as 'this'`, async () => {
    const answer = await prompt({
      type: 'password',
      name: 'password',
      message: 'What is your password?',
      skip: true,
      initial: 'blue',
      format(value) {
        assertType<Prompt<string>>(this)
        return value
      }
    })

    assert.deepEqual(answer, { password: 'blue' })
  })

  it('specify result function', async () => {
    const answer = await prompt({
      type: 'password',
      name: 'password',
      message: 'What is your password?',
      skip: true,
      initial: 'blue',
      result(value) {
        assertType.isString(value)
        return value + 'r'
      }
    })

    assert.deepEqual(answer, { password: 'bluer' })
  })

  it('specify result async function', async () => {
    const answer = await prompt({
      type: 'password',
      name: 'password',
      message: 'What is your password?',
      skip: true,
      initial: 'blue',
      result(value) {
        assertType.isString(value)
        return Promise.resolve(value + 'r')
      }
    })

    assert.deepEqual(answer, { password: 'bluer' })
  })

  it(`result function receives Prompt as 'this'`, async () => {
    const answer = await prompt({
      type: 'password',
      name: 'password',
      message: 'What is your password?',
      skip: true,
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
    const answer = await prompt({
      type: 'password',
      name: 'password',
      message: 'What is your password?',
      skip: true,
      initial: 'blue',
      validate(value) {
        assertType.isString(value)
        return ''
      }
    })

    assert.deepEqual(answer, { password: 'bluer' })
  })

  it('specify validate with boolean function', async () => {
    const answer = await prompt({
      type: 'password',
      name: 'password',
      message: 'What is your password?',
      skip: true,
      initial: 'blue',
      validate(value) {
        assertType.isString(value)
        return true
      }
    })

    assert.deepEqual(answer, { password: 'blue' })
  })

  it('specify validate async boolean function', async () => {
    const answer = await prompt({
      type: 'password',
      name: 'password',
      message: 'What is your password?',
      skip: true,
      initial: 'blue',
      validate(value) {
        assertType.isString(value)
        return Promise.resolve(true)
      }
    })

    assert.deepEqual(answer, { password: 'blue' })
  })

  it(`validate function receives Prompt as 'this'`, async () => {
    const answer = await prompt({
      type: 'password',
      name: 'password',
      message: 'What is your password?',
      skip: true,
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
    testType(() => prompt({
      type: 'invisible',
      name: 'secret',
      message: 'What is your secret?',
    }))
  })

  it('skip will skip the prompt', async () => {
    const answer = await prompt({
      type: 'invisible',
      name: 'secret',
      message: 'What is your secret?',
      skip: true
    })

    assert.deepEqual(answer, { secret: '' })
  })

  it('skip with function', async () => {
    const answer = await prompt({
      type: 'invisible',
      name: 'secret',
      message: 'What is your secret?',
      skip: () => true
    })

    assert.deepEqual(answer, { secret: '' })
  })

  it('skip with async function', async () => {
    const answer = await prompt({
      type: 'invisible',
      name: 'secret',
      message: 'What is your secret?',
      skip: () => Promise.resolve(true)
    })

    assert.deepEqual(answer, { secret: '' })
  })

  it('skip with delayed async function', async () => {
    const answer = await prompt({
      type: 'invisible',
      name: 'secret',
      message: 'What is your secret?',
      skip: () => new Promise(a => setImmediate(() => a(true)))
    })

    assert.deepEqual(answer, { secret: '' })
  })

  it('specify initial value', async () => {
    const answer = await prompt({
      type: 'invisible',
      name: 'secret',
      message: 'What is your secret?',
      skip: true,
      initial: 'blue'
    })

    assert.deepEqual(answer, { secret: 'blue' })
  })

  it.skip('initial with function', async () => {
    const answer = await prompt({
      type: 'invisible',
      name: 'secret',
      message: 'What is your secret?',
      skip: true,
      initial: () => 'blue'
    })

    assert.deepEqual(answer, { secret: 'blue' })
  })

  it.skip('initial with async function', async () => {
    const answer = await prompt({
      type: 'invisible',
      name: 'secret',
      message: 'What is your secret?',
      skip: true,
      initial: () => Promise.resolve('blue')
    })

    assert.deepEqual(answer, { secret: 'blue' })
  })

  it.skip('initial with async function', async () => {
    const answer = await prompt({
      type: 'invisible',
      name: 'secret',
      message: 'What is your secret?',
      skip: true,
      initial: () => new Promise(a => setImmediate(() => a('blue')))
    })

    assert.deepEqual(answer, { secret: 'blue' })
  })

  it('specify format function', async () => {
    const answer = await prompt({
      type: 'invisible',
      name: 'secret',
      message: 'What is your secret?',
      skip: true,
      initial: 'blue',
      format(value) {
        assertType.isString(value)
        return value
      }
    })

    assert.deepEqual(answer, { secret: 'blue' })
  })

  it('specify format async function', async () => {
    const answer = await prompt({
      type: 'invisible',
      name: 'secret',
      message: 'What is your secret?',
      skip: true,
      initial: 'blue',
      format(value) {
        assertType.isString(value)
        return Promise.resolve(value)
      }
    })

    assert.deepEqual(answer, { secret: 'blue' })
  })

  it(`format function receives Prompt as 'this'`, async () => {
    const answer = await prompt({
      type: 'invisible',
      name: 'secret',
      message: 'What is your secret?',
      skip: true,
      initial: 'blue',
      format(value) {
        assertType<Prompt<string>>(this)
        return value
      }
    })

    assert.deepEqual(answer, { secret: 'blue' })
  })

  it('specify result function', async () => {
    const answer = await prompt({
      type: 'invisible',
      name: 'secret',
      message: 'What is your secret?',
      skip: true,
      initial: 'blue',
      result(value) {
        assertType.isString(value)
        return value + 'r'
      }
    })

    assert.deepEqual(answer, { secret: 'bluer' })
  })

  it('specify result async function', async () => {
    const answer = await prompt({
      type: 'invisible',
      name: 'secret',
      message: 'What is your secret?',
      skip: true,
      initial: 'blue',
      result(value) {
        assertType.isString(value)
        return Promise.resolve(value + 'r')
      }
    })

    assert.deepEqual(answer, { secret: 'bluer' })
  })

  it(`result function receives Prompt as 'this'`, async () => {
    const answer = await prompt({
      type: 'invisible',
      name: 'secret',
      message: 'What is your secret?',
      skip: true,
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
    const answer = await prompt({
      type: 'invisible',
      name: 'secret',
      message: 'What is your secret?',
      skip: true,
      initial: 'blue',
      validate(value) {
        assertType.isString(value)
        return ''
      }
    })

    assert.deepEqual(answer, { secret: 'bluer' })
  })

  it('specify validate with boolean function', async () => {
    const answer = await prompt({
      type: 'invisible',
      name: 'secret',
      message: 'What is your secret?',
      skip: true,
      initial: 'blue',
      validate(value) {
        assertType.isString(value)
        return true
      }
    })

    assert.deepEqual(answer, { secret: 'blue' })
  })

  it('specify validate async boolean function', async () => {
    const answer = await prompt({
      type: 'invisible',
      name: 'secret',
      message: 'What is your secret?',
      skip: true,
      initial: 'blue',
      validate(value) {
        assertType.isString(value)
        return Promise.resolve(true)
      }
    })

    assert.deepEqual(answer, { secret: 'blue' })
  })

  it(`validate function receives Prompt as 'this'`, async () => {
    const answer = await prompt({
      type: 'invisible',
      name: 'secret',
      message: 'What is your secret?',
      skip: true,
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
    testType(() => prompt({
      type: 'toggle',
      name: 'question',
      message: 'Want to answer?',
      enabled: 'Yep',
      disabled: 'Nope',
    }))
  })

  it('skip will skip the prompt', async () => {
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
    const answer = await prompt({
      type: 'toggle',
      name: 'question',
      message: 'Want to answer?',
      enabled: 'Yep',
      disabled: 'Nope',
      skip: true,
      initial: true
    })

    assert.deepEqual(answer, { question: true })
  })

  it.skip('initial with function', async () => {
    const answer = await prompt({
      type: 'toggle',
      name: 'question',
      message: 'Want to answer?',
      enabled: 'Yep',
      disabled: 'Nope',
      skip: true,
      initial: () => true
    })

    assert.deepEqual(answer, { question: true })
  })

  it.skip('initial with async function', async () => {
    const answer = await prompt({
      type: 'toggle',
      name: 'question',
      message: 'Want to answer?',
      enabled: 'Yep',
      disabled: 'Nope',
      skip: true,
      initial: () => Promise.resolve(true)
    })

    assert.deepEqual(answer, { question: true })
  })

  it.skip('initial with async function', async () => {
    const answer = await prompt({
      type: 'toggle',
      name: 'question',
      message: 'Want to answer?',
      enabled: 'Yep',
      disabled: 'Nope',
      skip: true,
      initial: () => new Promise(a => setImmediate(() => a(true)))
    })

    assert.deepEqual(answer, { question: true })
  })

  it('specify format function', async () => {
    const answer = await prompt({
      type: 'toggle',
      name: 'question',
      message: 'Want to answer?',
      enabled: 'Yep',
      disabled: 'Nope',
      skip: true,
      initial: true,
      format(value) {
        assertType.isBoolean(value)
        return `(${value})`
      }
    })

    assert.deepEqual(answer, { question: true })
  })

  it('specify format async function', async () => {
    const answer = await prompt({
      type: 'toggle',
      name: 'question',
      message: 'Want to answer?',
      enabled: 'Yep',
      disabled: 'Nope',
      skip: true,
      initial: true,
      format(value) {
        assertType.isBoolean(value)
        return Promise.resolve(`(${value})`)
      }
    })

    assert.deepEqual(answer, { question: true })
  })

  it(`format function receives Prompt as 'this'`, async () => {
    const answer = await prompt({
      type: 'toggle',
      name: 'question',
      message: 'Want to answer?',
      enabled: 'Yep',
      disabled: 'Nope',
      skip: true,
      initial: true,
      format(value) {
        assertType<Prompt<boolean>>(this)
        return `(${value})`
      }
    })

    assert.deepEqual(answer, { question: true })
  })

  it('specify result function', async () => {
    const answer = await prompt({
      type: 'toggle',
      name: 'question',
      message: 'Want to answer?',
      enabled: 'Yep',
      disabled: 'Nope',
      skip: true,
      initial: true,
      result(value) {
        assertType.isBoolean(value)
        return value
      }
    })

    assert.deepEqual(answer, { question: true })
  })

  it('specify result async function', async () => {
    const answer = await prompt({
      type: 'toggle',
      name: 'question',
      message: 'Want to answer?',
      enabled: 'Yep',
      disabled: 'Nope',
      skip: true,
      initial: true,
      result(value) {
        assertType.isBoolean(value)
        return Promise.resolve(value)
      }
    })

    assert.deepEqual(answer, { question: true })
  })

  it(`result function receives Prompt as 'this'`, async () => {
    const answer = await prompt({
      type: 'toggle',
      name: 'question',
      message: 'Want to answer?',
      enabled: 'Yep',
      disabled: 'Nope',
      skip: true,
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
    const answer = await prompt({
      type: 'toggle',
      name: 'question',
      message: 'Want to answer?',
      enabled: 'Yep',
      disabled: 'Nope',
      skip: true,
      initial: true,
      validate(value) {
        assertType.isBoolean(value)
        return ''
      }
    })

    assert.deepEqual(answer, { question: true })
  })

  it('specify validate with boolean function', async () => {
    const answer = await prompt({
      type: 'toggle',
      name: 'question',
      message: 'Want to answer?',
      enabled: 'Yep',
      disabled: 'Nope',
      skip: true,
      initial: true,
      validate(value) {
        assertType.isBoolean(value)
        return true
      }
    })

    assert.deepEqual(answer, { question: true })
  })

  it('specify validate async boolean function', async () => {
    const answer = await prompt({
      type: 'toggle',
      name: 'question',
      message: 'Want to answer?',
      enabled: 'Yep',
      disabled: 'Nope',
      skip: true,
      initial: true,
      validate(value) {
        assertType.isBoolean(value)
        return Promise.resolve(true)
      }
    })

    assert.deepEqual(answer, { question: true })
  })

  it(`validate function receives Prompt as 'this'`, async () => {
    const answer = await prompt({
      type: 'toggle',
      name: 'question',
      message: 'Want to answer?',
      enabled: 'Yep',
      disabled: 'Nope',
      skip: true,
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
    const answer = await prompt({
      type: 'basicauth',
      name: 'authenticated',
      message: 'Please enter your username and password',
      username: 'rajat-sr',
      password: '123',
      showPassword: false,
      skip: true,
      format(value) {
        assertType.isBoolean(value)
        return `(${value})`
      }
    })

    assert.deepEqual(answer, { authenticated: false })
  })

  it('specify format async function', async () => {
    const answer = await prompt({
      type: 'basicauth',
      name: 'authenticated',
      message: 'Please enter your username and password',
      username: 'rajat-sr',
      password: '123',
      showPassword: false,
      skip: true,
      format(value) {
        assertType.isBoolean(value)
        return Promise.resolve(`(${value})`)
      }
    })

    assert.deepEqual(answer, { authenticated: false })
  })

  it(`format function receives Prompt as 'this'`, async () => {
    const answer = await prompt({
      type: 'basicauth',
      name: 'authenticated',
      message: 'Please enter your username and password',
      username: 'rajat-sr',
      password: '123',
      showPassword: false,
      skip: true,
      format(value) {
        assertType<Prompt<boolean>>(this)
        return `(${value})`
      }
    })

    assert.deepEqual(answer, { authenticated: false })
  })

  it('specify result function', async () => {
    const answer = await prompt({
      type: 'basicauth',
      name: 'authenticated',
      message: 'Please enter your username and password',
      username: 'rajat-sr',
      password: '123',
      showPassword: false,
      skip: true,
      result(value) {
        assertType.isBoolean(value)
        return value
      }
    })

    assert.deepEqual(answer, { authenticated: false })
  })

  it('specify result async function', async () => {
    const answer = await prompt({
      type: 'basicauth',
      name: 'authenticated',
      message: 'Please enter your username and password',
      username: 'rajat-sr',
      password: '123',
      showPassword: false,
      skip: true,
      result(value) {
        assertType.isBoolean(value)
        return Promise.resolve(value)
      }
    })

    assert.deepEqual(answer, { authenticated: false })
  })

  it(`result function receives Prompt as 'this'`, async () => {
    const answer = await prompt({
      type: 'basicauth',
      name: 'authenticated',
      message: 'Please enter your username and password',
      username: 'rajat-sr',
      password: '123',
      showPassword: false,
      skip: true,
      result(value) {
        assertType<Prompt<boolean>>(this)
        assert(this instanceof Enquirer.Prompt)
        return value
      }
    })

    assert.deepEqual(answer, { authenticated: false })
  })

  it.skip('specify validate function', async () => {
    const answer = await prompt({
      type: 'basicauth',
      name: 'authenticated',
      message: 'Please enter your username and password',
      username: 'rajat-sr',
      password: '123',
      showPassword: false,
      skip: true,
      validate(value) {
        assertType.isBoolean(value)
        return ''
      }
    })

    assert.deepEqual(answer, { authenticated: false })
  })

  it('specify validate with boolean function', async () => {
    const answer = await prompt({
      type: 'basicauth',
      name: 'authenticated',
      message: 'Please enter your username and password',
      username: 'rajat-sr',
      password: '123',
      showPassword: false,
      skip: true,
      validate(value) {
        assertType.isBoolean(value)
        return true
      }
    })

    assert.deepEqual(answer, { authenticated: false })
  })

  it('specify validate async boolean function', async () => {
    const answer = await prompt({
      type: 'basicauth',
      name: 'authenticated',
      message: 'Please enter your username and password',
      username: 'rajat-sr',
      password: '123',
      showPassword: false,
      skip: true,
      validate(value) {
        assertType.isBoolean(value)
        return Promise.resolve(true)
      }
    })

    assert.deepEqual(answer, { authenticated: false })
  })

  it(`validate function receives Prompt as 'this'`, async () => {
    const answer = await prompt({
      type: 'basicauth',
      name: 'authenticated',
      message: 'Please enter your username and password',
      username: 'rajat-sr',
      password: '123',
      showPassword: false,
      skip: true,
      validate() {
        assertType<Prompt<boolean>>(this)
        assert(this instanceof Enquirer.Prompt)
        return true
      }
    })

    assert.deepEqual(answer, { authenticated: false })
  })
});
