import assert from 'assert'
import { assertType } from 'type-plus'
import Enquirer, { Prompt } from '../..'
import { testType } from '../support'

describe('alternative signature tests', () => {
  it('call with function', () => {
    const { prompt } = Enquirer
    testType(() => prompt(() => ({
      type: 'input',
      name: 'color',
      message: 'Favorite color?',
    })))
  })

  it('call with array of questions', () => {
    const { prompt } = Enquirer

    testType(() => prompt([{
      type: 'input',
      name: 'color',
      message: 'Favorite color?',
    }]))
  })

  it('call with array of function to questions', () => {
    const { prompt } = Enquirer

    testType(() => prompt([() => ({
      type: 'input',
      name: 'color',
      message: 'Favorite color?',
    })]))
  })
})

describe('input prompt', () => {
  const minimumQuestion = {
    type: 'input' as const,
    name: 'color',
    message: 'Favorite color?',
  }

  async function testQuestionType(
    question: Enquirer.prompt.InputQuestion,
    expectedAnswer = ''
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
    testType(() => prompt({
      type: 'input',
      name: 'color',
      message: 'Favorite color?',
    }))
  })

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

  it('specify initial value', async () => {
    await testQuestionType({
      ...minimumQuestion,
      initial: 'blue',
      show: false
    }, 'blue')
  })

  it('initial with function', async () => {
    await testQuestionType({
      ...minimumQuestion,
      initial: () => 'blue',
      show: false
    }, 'blue')
  })

  it('initial with async function', async () => {
    await testQuestionType({
      ...minimumQuestion,
      initial: () => Promise.resolve('blue'),
      show: false
    }, 'blue')
  })

  it.skip('initial with delayed async function', async () => {
    await testQuestionType({
      ...minimumQuestion,
      initial: () => new Promise(a => setImmediate(() => a('blue'))),
      show: false
    }, 'blue')
  })

  it('specify format function', async () => {
    let called = false
    await testQuestionType({
      ...minimumQuestion,
      initial: 'blue',
      format(value) {
        called = true
        assertType<string | undefined>(value)
        return value || ''
      },
      show: false
    }, 'blue')
    assert.ok(called)
  })

  it('specify format async function', async () => {
    await testQuestionType({
      ...minimumQuestion,
      show: false,
      initial: 'blue',
      format(value) {
        assertType<string | undefined>(value)
        return Promise.resolve(value || '')
      }
    }, 'blue')
  })

  it(`format function receives Prompt as 'this'`, async () => {
    await testQuestionType({
      ...minimumQuestion,
      show: false,
      initial: 'blue',
      format(value) {
        assertType<Prompt<string>>(this)
        return value || ''
      }
    }, 'blue')
  })

  it.skip('specify validate function', async () => {
    await testQuestionType({
      ...minimumQuestion,
      show: false,
      initial: 'blue',
      validate(value) {
        assertType.isString(value)
        return ''
      }
    }, 'blue')
  })

  it('specify validate with boolean function', async () => {
    await testQuestionType({
      ...minimumQuestion,
      show: false,
      initial: 'blue',
      validate(value) {
        assertType.isString(value)
        return true
      }
    }, 'blue')
  })

  it('specify validate async boolean function', async () => {
    await testQuestionType({
      ...minimumQuestion,
      show: false,
      initial: 'blue',
      validate(value) {
        assertType.isString(value)
        return Promise.resolve(true)
      }
    }, 'blue')
  })

  it(`validate function receives Prompt as 'this'`, async () => {
    await testQuestionType({
      ...minimumQuestion,
      show: false,
      initial: 'blue',
      validate() {
        assertType<Prompt<string>>(this)
        assert(this instanceof Enquirer.Prompt)
        return true
      }
    }, 'blue')
  })

  it('specify result function', async () => {
    await testQuestionType({
      ...minimumQuestion,
      show: false,
      initial: 'blue',
      result(value) {
        assertType.isString(value)
        return value + 'r'
      }
    }, 'bluer')
  })

  it('specify result async function', async () => {
    await testQuestionType({
      ...minimumQuestion,
      show: false,
      initial: 'blue',
      result(value) {
        assertType.isString(value)
        return Promise.resolve(value + 'r')
      }
    }, 'bluer')
  })

  it(`result function receives Prompt as 'this'`, async () => {
    await testQuestionType({
      ...minimumQuestion,
      show: false,
      initial: 'blue',
      result(value) {
        assertType<Prompt<string>>(this)
        assert(this instanceof Enquirer.Prompt)
        return value
      }
    }, 'blue')
  })
});

describe('text prompt', () => {
  const minimumQuestion = {
    type: 'text' as const,
    name: 'color',
    message: 'Favorite color?',
  }

  async function testQuestionType(
    question: Enquirer.prompt.TextQuestion,
    expectedAnswer = ''
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
    testType(() => prompt({
      type: 'text',
      name: 'color',
      message: 'Favorite color?',
    }))
  })

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

  it('specify initial value', async () => {
    await testQuestionType({
      ...minimumQuestion,
      initial: 'blue',
      show: false
    }, 'blue')
  })

  it('initial with function', async () => {
    await testQuestionType({
      ...minimumQuestion,
      initial: () => 'blue',
      show: false
    }, 'blue')
  })

  it('initial with async function', async () => {
    await testQuestionType({
      ...minimumQuestion,
      initial: () => Promise.resolve('blue'),
      show: false
    }, 'blue')
  })

  it.skip('initial with delayed async function', async () => {
    await testQuestionType({
      ...minimumQuestion,
      initial: () => new Promise(a => setImmediate(() => a('blue'))),
      show: false
    }, 'blue')
  })

  it('specify format function', async () => {
    let called = false
    await testQuestionType({
      ...minimumQuestion,
      initial: 'blue',
      format(value) {
        called = true
        assertType<string | undefined>(value)
        return value || ''
      },
      show: false
    }, 'blue')
    assert.ok(called)
  })

  it('specify format async function', async () => {
    await testQuestionType({
      ...minimumQuestion,
      show: false,
      initial: 'blue',
      format(value) {
        assertType<string | undefined>(value)
        return Promise.resolve(value || '')
      }
    }, 'blue')
  })

  it(`format function receives Prompt as 'this'`, async () => {
    await testQuestionType({
      ...minimumQuestion,
      show: false,
      initial: 'blue',
      format(value) {
        assertType<Prompt<string>>(this)
        return value || ''
      }
    }, 'blue')
  })

  it.skip('specify validate function', async () => {
    await testQuestionType({
      ...minimumQuestion,
      show: false,
      initial: 'blue',
      validate(value) {
        assertType.isString(value)
        return ''
      }
    }, 'blue')
  })

  it('specify validate with boolean function', async () => {
    await testQuestionType({
      ...minimumQuestion,
      show: false,
      initial: 'blue',
      validate(value) {
        assertType.isString(value)
        return true
      }
    }, 'blue')
  })

  it('specify validate async boolean function', async () => {
    await testQuestionType({
      ...minimumQuestion,
      show: false,
      initial: 'blue',
      validate(value) {
        assertType.isString(value)
        return Promise.resolve(true)
      }
    }, 'blue')
  })

  it(`validate function receives Prompt as 'this'`, async () => {
    await testQuestionType({
      ...minimumQuestion,
      show: false,
      initial: 'blue',
      validate() {
        assertType<Prompt<string>>(this)
        assert(this instanceof Enquirer.Prompt)
        return true
      }
    }, 'blue')
  })

  it('specify result function', async () => {
    await testQuestionType({
      ...minimumQuestion,
      show: false,
      initial: 'blue',
      result(value) {
        assertType.isString(value)
        return value + 'r'
      }
    }, 'bluer')
  })

  it('specify result async function', async () => {
    await testQuestionType({
      ...minimumQuestion,
      show: false,
      initial: 'blue',
      result(value) {
        assertType.isString(value)
        return Promise.resolve(value + 'r')
      }
    }, 'bluer')
  })

  it(`result function receives Prompt as 'this'`, async () => {
    await testQuestionType({
      ...minimumQuestion,
      show: false,
      initial: 'blue',
      result(value) {
        assertType<Prompt<string>>(this)
        assert(this instanceof Enquirer.Prompt)
        return value
      }
    }, 'blue')
  })
});

describe('confirm prompt', () => {
  const minimumQuestion = {
    type: 'confirm' as const,
    name: 'question',
    message: 'Want to answer?',
  }

  async function testQuestionType(
    question: Enquirer.prompt.ConfirmQuestion,
    expectedAnswer = false
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
    testType(() => prompt({
      type: 'confirm',
      name: 'question',
      message: 'Want to answer?',
    }))
  })

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

  it('specify initial value', async () => {
    await testQuestionType({
      ...minimumQuestion,
      show: false,
      initial: true
    }, true)
  })

  it.skip('initial with function', async () => {
    await testQuestionType({
      ...minimumQuestion,
      show: false,
      initial: () => true
    }, true)
  })

  it.skip('initial with async function', async () => {
    await testQuestionType({
      ...minimumQuestion,
      show: false,
      initial: () => Promise.resolve(true)
    }, true)
  })

  it.skip('initial with async function', async () => {
    await testQuestionType({
      ...minimumQuestion,
      show: false,
      initial: () => new Promise(a => setImmediate(() => a(true)))
    }, true)
  })

  it('specify format function', async () => {
    await testQuestionType({
      ...minimumQuestion,
      show: false,
      initial: true,
      format(value) {
        assertType<boolean | undefined>(value)
        return `(${value})`
      }
    }, true)
  })

  it('specify format async function', async () => {
    await testQuestionType({
      ...minimumQuestion,
      show: false,
      initial: true,
      format(value) {
        assertType<boolean | undefined>(value)
        return Promise.resolve(`(${value})`)
      }
    }, true)
  })

  it(`format function receives Prompt as 'this'`, async () => {
    await testQuestionType({
      ...minimumQuestion,
      show: false,
      initial: true,
      format(value) {
        assertType<Prompt<boolean>>(this)
        return `(${value})`
      }
    }, true)
  })

  it('specify result function', async () => {
    await testQuestionType({
      ...minimumQuestion,
      show: false,
      initial: true,
      result(value) {
        assertType.isBoolean(value)
        return value
      }
    }, true)
  })

  it('specify result async function', async () => {
    await testQuestionType({
      ...minimumQuestion,
      show: false,
      initial: true,
      result(value) {
        assertType.isBoolean(value)
        return Promise.resolve(value)
      }
    }, true)
  })

  it(`result function receives Prompt as 'this'`, async () => {
    await testQuestionType({
      ...minimumQuestion,
      show: false,
      initial: true,
      result(value) {
        assertType<Prompt<boolean>>(this)
        assert(this instanceof Enquirer.Prompt)
        return value
      }
    }, true)
  })

  it.skip('specify validate function', async () => {
    await testQuestionType({
      ...minimumQuestion,
      show: false,
      initial: true,
      validate(value) {
        assertType.isBoolean(value)
        return ''
      }
    }, true)
  })

  it('specify validate with boolean function', async () => {
    await testQuestionType({
      ...minimumQuestion,
      show: false,
      initial: true,
      validate(value) {
        assertType.isBoolean(value)
        return true
      }
    }, true)
  })

  it('specify validate async boolean function', async () => {
    await testQuestionType({
      ...minimumQuestion,
      show: false,
      initial: true,
      validate(value) {
        assertType.isBoolean(value)
        return Promise.resolve(true)
      }
    }, true)
  })

  it(`validate function receives Prompt as 'this'`, async () => {
    await testQuestionType({
      ...minimumQuestion,
      show: false,
      initial: true,
      validate() {
        assertType<Prompt<boolean>>(this)
        assert(this instanceof Enquirer.Prompt)
        return true
      }
    }, true)
  })
});

describe('numeral prompt', () => {
  const minimumQuestion = {
    type: 'numeral' as const,
    name: 'number',
    message: 'Please enter a number',
  }

  async function testQuestionType(
    question: Enquirer.prompt.NumeralQuestion,
    expectedAnswer = 0
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
    testType(() => prompt({
      type: 'numeral',
      name: 'number',
      message: 'Please enter a number',
    }))
  })

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

  it('specify initial value', async () => {
    await testQuestionType({
      ...minimumQuestion,
      show: false,
      initial: 123
    }, 123)
  })

  it.skip('initial with function', async () => {
    await testQuestionType({
      ...minimumQuestion,
      show: false,
      initial: () => 123
    }, 123)
  })

  it.skip('initial with async function', async () => {
    await testQuestionType({
      ...minimumQuestion,
      show: false,
      initial: () => Promise.resolve(123)
    }, 123)
  })

  it.skip('initial with async function', async () => {
    await testQuestionType({
      ...minimumQuestion,
      show: false,
      initial: () => new Promise(a => setImmediate(() => a(123)))
    }, 123)
  })

  it('specify format function', async () => {
    await testQuestionType({
      ...minimumQuestion,
      show: false,
      initial: 123,
      format(value) {
        assertType<number | undefined>(value)
        return `(${value})`
      }
    }, 123)
  })

  it('specify format async function', async () => {
    await testQuestionType({
      ...minimumQuestion,
      show: false,
      initial: 123,
      format(value) {
        assertType<number | undefined>(value)
        return Promise.resolve(`(${value})`)
      }
    }, 123)
  })

  it(`format function receives Prompt as 'this'`, async () => {
    await testQuestionType({
      ...minimumQuestion,
      show: false,
      initial: 123,
      format(value) {
        assertType<Prompt<number>>(this)
        return `(${value})`
      }
    }, 123)
  })

  it('specify result function', async () => {
    await testQuestionType({
      ...minimumQuestion,
      show: false,
      initial: 123,
      result(value) {
        assertType.isNumber(value)
        return value
      }
    }, 123)
  })

  it('specify result async function', async () => {
    await testQuestionType({
      ...minimumQuestion,
      show: false,
      initial: 123,
      result(value) {
        assertType.isNumber(value)
        return Promise.resolve(value)
      }
    }, 123)
  })

  it(`result function receives Prompt as 'this'`, async () => {
    await testQuestionType({
      ...minimumQuestion,
      show: false,
      initial: 123,
      result(value) {
        assertType<Prompt<number>>(this)
        assert(this instanceof Enquirer.Prompt)
        return value
      }
    }, 123)
  })

  it.skip('specify validate function', async () => {
    await testQuestionType({
      ...minimumQuestion,
      show: false,
      initial: 123,
      validate(value) {
        assertType.isNumber(value)
        return ''
      }
    }, 123)
  })

  it('specify validate with boolean function', async () => {
    await testQuestionType({
      ...minimumQuestion,
      show: false,
      initial: 123,
      validate(value) {
        assertType.isNumber(value)
        return true
      }
    }, 123)
  })

  it('specify validate async boolean function', async () => {
    await testQuestionType({
      ...minimumQuestion,
      show: false,
      initial: 123,
      validate(value) {
        assertType.isNumber(value)
        return Promise.resolve(true)
      }
    }, 123)
  })

  it(`validate function receives Prompt as 'this'`, async () => {
    await testQuestionType({
      ...minimumQuestion,
      show: false,
      initial: 123,
      validate() {
        assertType<Prompt<number>>(this)
        assert(this instanceof Enquirer.Prompt)
        return true
      }
    }, 123)
  })
});

describe('password prompt', () => {
  const minimumQuestion = {
    type: 'password' as const,
    name: 'password',
    message: 'What is your password?',
  }

  async function testQuestionType(
    question: Enquirer.prompt.PasswordQuestion,
    expectedAnswer = ''
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
    testType(() => prompt({
      type: 'password',
      name: 'password',
      message: 'What is your password?',
    }))
  })

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

  it('specify initial value', async () => {
    await testQuestionType({
      ...minimumQuestion,
      show: false,
      initial: 'blue'
    }, 'blue')
  })

  it.skip('initial with function', async () => {
    await testQuestionType({
      ...minimumQuestion,
      show: false,
      initial: () => 'blue'
    }, 'blue')
  })

  it.skip('initial with async function', async () => {
    await testQuestionType({
      ...minimumQuestion,
      show: false,
      initial: () => Promise.resolve('blue')
    }, 'blue')
  })

  it.skip('initial with async function', async () => {
    await testQuestionType({
      ...minimumQuestion,
      show: false,
      initial: () => new Promise(a => setImmediate(() => a('blue')))
    }, 'blue')
  })

  it('specify format function', async () => {
    await testQuestionType({
      ...minimumQuestion,
      show: false,
      initial: 'blue',
      format(value) {
        assertType<string | undefined>(value)
        return value || ''
      }
    }, 'blue')
  })

  it('specify format async function', async () => {
    await testQuestionType({
      ...minimumQuestion,
      show: false,
      initial: 'blue',
      format(value) {
        assertType<string | undefined>(value)
        return Promise.resolve(value || '')
      }
    }, 'blue')
  })

  it(`format function receives Prompt as 'this'`, async () => {
    await testQuestionType({
      ...minimumQuestion,
      show: false,
      initial: 'blue',
      format(value) {
        assertType<Prompt<string>>(this)
        return value || ''
      }
    }, 'blue')
  })

  it.skip('specify validate function', async () => {
    await testQuestionType({
      ...minimumQuestion,
      show: false,
      initial: 'blue',
      validate(value) {
        assertType.isString(value)
        return ''
      }
    }, 'blue')
  })

  it('specify validate with boolean function', async () => {
    await testQuestionType({
      ...minimumQuestion,
      show: false,
      initial: 'blue',
      validate(value) {
        assertType.isString(value)
        return true
      }
    }, 'blue')
  })

  it('specify validate async boolean function', async () => {
    await testQuestionType({
      ...minimumQuestion,
      show: false,
      initial: 'blue',
      validate(value) {
        assertType.isString(value)
        return Promise.resolve(true)
      }
    }, 'blue')
  })

  it(`validate function receives Prompt as 'this'`, async () => {
    await testQuestionType({
      ...minimumQuestion,
      show: false,
      initial: 'blue',
      validate() {
        assertType<Prompt<string>>(this)
        assert(this instanceof Enquirer.Prompt)
        return true
      }
    }, 'blue')
  })

  it('specify result function', async () => {
    await testQuestionType({
      ...minimumQuestion,
      show: false,
      initial: 'blue',
      result(value) {
        assertType.isString(value)
        return value + 'r'
      }
    }, 'bluer')
  })

  it('specify result async function', async () => {
    await testQuestionType({
      ...minimumQuestion,
      show: false,
      initial: 'blue',
      result(value) {
        assertType.isString(value)
        return Promise.resolve(value + 'r')
      }
    }, 'bluer')
  })

  it(`result function receives Prompt as 'this'`, async () => {
    await testQuestionType({
      ...minimumQuestion,
      show: false,
      initial: 'blue',
      result(value) {
        assertType<Prompt<string>>(this)
        assert(this instanceof Enquirer.Prompt)
        return value
      }
    }, 'blue')
  })
});

describe('invisible prompt', () => {
  const minimumQuestion = {
    type: 'invisible' as const,
    name: 'secret',
    message: 'What is your secret?',
  }

  async function testQuestionType(
    question: Enquirer.prompt.InvisibleQuestion,
    expectedAnswer = ''
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
    testType(() => prompt({
      type: 'invisible',
      name: 'secret',
      message: 'What is your secret?',
    }))
  })

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

  it('specify initial value', async () => {
    await testQuestionType({
      ...minimumQuestion,
      show: false,
      initial: 'blue'
    }, 'blue')
  })

  it.skip('initial with function', async () => {
    await testQuestionType({
      ...minimumQuestion,
      show: false,
      initial: () => 'blue'
    }, 'blue')
  })

  it.skip('initial with async function', async () => {
    await testQuestionType({
      ...minimumQuestion,
      show: false,
      initial: () => Promise.resolve('blue')
    }, 'blue')
  })

  it.skip('initial with async function', async () => {
    await testQuestionType({
      ...minimumQuestion,
      show: false,
      initial: () => new Promise(a => setImmediate(() => a('blue')))
    }, 'blue')
  })

  it('specify format function', async () => {
    await testQuestionType({
      ...minimumQuestion,
      show: false,
      initial: 'blue',
      format(value) {
        assertType<string | undefined>(value)
        return value || ''
      }
    }, 'blue')
  })

  it('specify format async function', async () => {
    await testQuestionType({
      ...minimumQuestion,
      show: false,
      initial: 'blue',
      format(value) {
        assertType<string | undefined>(value)
        return Promise.resolve(value || '')
      }
    }, 'blue')
  })

  it(`format function receives Prompt as 'this'`, async () => {
    await testQuestionType({
      ...minimumQuestion,
      show: false,
      initial: 'blue',
      format(value) {
        assertType<Prompt<string>>(this)
        return value || ''
      }
    }, 'blue')
  })

  it('specify result function', async () => {
    await testQuestionType({
      ...minimumQuestion,
      show: false,
      initial: 'blue',
      result(value) {
        assertType.isString(value)
        return value + 'r'
      }
    }, 'bluer')
  })

  it('specify result async function', async () => {
    await testQuestionType({
      ...minimumQuestion,
      show: false,
      initial: 'blue',
      result(value) {
        assertType.isString(value)
        return Promise.resolve(value + 'r')
      }
    }, 'bluer')
  })

  it(`result function receives Prompt as 'this'`, async () => {
    await testQuestionType({
      ...minimumQuestion,
      show: false,
      initial: 'blue',
      result(value) {
        assertType<Prompt<string>>(this)
        assert(this instanceof Enquirer.Prompt)
        return value
      }
    }, 'blue')
  })

  it.skip('specify validate function', async () => {
    await testQuestionType({
      ...minimumQuestion,
      show: false,
      initial: 'blue',
      validate(value) {
        assertType.isString(value)
        return ''
      }
    }, 'blue')
  })

  it('specify validate with boolean function', async () => {
    await testQuestionType({
      ...minimumQuestion,
      show: false,
      initial: 'blue',
      validate(value) {
        assertType.isString(value)
        return true
      }
    }, 'blue')
  })

  it('specify validate async boolean function', async () => {
    await testQuestionType({
      ...minimumQuestion,
      show: false,
      initial: 'blue',
      validate(value) {
        assertType.isString(value)
        return Promise.resolve(true)
      }
    }, 'blue')
  })

  it(`validate function receives Prompt as 'this'`, async () => {
    await testQuestionType({
      ...minimumQuestion,
      show: false,
      initial: 'blue',
      validate() {
        assertType<Prompt<string>>(this)
        assert(this instanceof Enquirer.Prompt)
        return true
      }
    }, 'blue')
  })
});

describe('toggle prompt', () => {
  const minimumQuestion = {
    type: 'toggle' as const,
    name: 'question',
    message: 'Want to answer?',
    enabled: 'Yep',
    disabled: 'Nope',
  }

  async function testQuestionType(
    question: Enquirer.prompt.ToggleQuestion,
    expectedAnswer = false
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
    testType(() => prompt({
      type: 'toggle',
      name: 'question',
      message: 'Want to answer?',
      enabled: 'Yep',
      disabled: 'Nope',
    }))
  })

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

  it('specify initial value', async () => {
    await testQuestionType({
      ...minimumQuestion,
      show: false,
      initial: true
    }, true)
  })

  it.skip('initial with function', async () => {
    await testQuestionType({
      ...minimumQuestion,
      show: false,
      initial: () => true
    }, true)
  })

  it.skip('initial with async function', async () => {
    await testQuestionType({
      ...minimumQuestion,
      show: false,
      initial: () => Promise.resolve(true)
    }, true)
  })

  it.skip('initial with async function', async () => {
    await testQuestionType({
      ...minimumQuestion,
      show: false,
      initial: () => new Promise<boolean>(a => setImmediate(() => a(true)))
    }, true)
  })

  it('specify format function', async () => {
    await testQuestionType({
      ...minimumQuestion,
      show: false,
      initial: true,
      format(value) {
        assertType<boolean | undefined>(value)
        return `(${value})`
      }
    }, true)
  })

  it('specify format async function', async () => {
    await testQuestionType({
      ...minimumQuestion,
      show: false,
      initial: true,
      format(value) {
        assertType<boolean | undefined>(value)
        return Promise.resolve(`(${value})`)
      }
    }, true)
  })

  it(`format function receives Prompt as 'this'`, async () => {
    await testQuestionType({
      ...minimumQuestion,
      show: false,
      initial: true,
      format(value) {
        assertType<Prompt<boolean>>(this)
        return `(${value})`
      }
    }, true)
  })

  it('specify result function', async () => {
    await testQuestionType({
      ...minimumQuestion,
      show: false,
      initial: true,
      result(value) {
        assertType.isBoolean(value)
        return value
      }
    }, true)
  })

  it('specify result async function', async () => {
    await testQuestionType({
      ...minimumQuestion,
      show: false,
      initial: true,
      result(value) {
        assertType.isBoolean(value)
        return Promise.resolve(value)
      }
    }, true)
  })

  it(`result function receives Prompt as 'this'`, async () => {
    await testQuestionType({
      ...minimumQuestion,
      show: false,
      initial: true,
      result(value) {
        assertType<Prompt<boolean>>(this)
        assert(this instanceof Enquirer.Prompt)
        return value
      }
    }, true)
  })

  it.skip('specify validate function', async () => {
    await testQuestionType({
      ...minimumQuestion,
      show: false,
      initial: true,
      validate(value) {
        assertType.isBoolean(value)
        return ''
      }
    }, true)
  })

  it('specify validate with boolean function', async () => {
    await testQuestionType({
      ...minimumQuestion,
      show: false,
      initial: true,
      validate(value) {
        assertType.isBoolean(value)
        return true
      }
    }, true)
  })

  it('specify validate async boolean function', async () => {
    await testQuestionType({
      ...minimumQuestion,
      show: false,
      initial: true,
      validate(value) {
        assertType.isBoolean(value)
        return Promise.resolve(true)
      }
    }, true)
  })

  it(`validate function receives Prompt as 'this'`, async () => {
    await testQuestionType({
      ...minimumQuestion,
      show: false,
      initial: true,
      validate() {
        assertType<Prompt<boolean>>(this)
        assert(this instanceof Enquirer.Prompt)
        return true
      }
    }, true)
  })
});

describe('basicauth prompt', () => {
  const minimumQuestion = {
    type: 'basicauth' as const,
    name: 'authenticated',
    message: 'Please enter your username and password',
    username: 'rajat-sr',
    password: '123',
    showPassword: false,
  }

  async function testQuestionType(
    question: Enquirer.prompt.BasicAuthQuestion,
    expectedAnswer = ''
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
      skip: () => new Promise(a => setImmediate(() => a(true))),
    })
  })

  it('specify format function', async () => {
    await testQuestionType({
      ...minimumQuestion,
      show: false,
      format(value) {
        assertType<boolean | undefined>(value)
        return `(${value})`
      }
    })
  })

  it('specify format async function', async () => {
    await testQuestionType({
      ...minimumQuestion,
      show: false,
      format(value) {
        assertType<boolean | undefined>(value)
        return Promise.resolve(`(${value})`)
      }
    })
  })

  it(`format function receives Prompt as 'this'`, async () => {
    await testQuestionType({
      ...minimumQuestion,
      show: false,
      format(value) {
        assertType<Prompt<boolean>>(this)
        return `(${value})`
      }
    })
  })

  it('specify result function', async () => {
    await testQuestionType({
      ...minimumQuestion,
      show: false,
      result(value) {
        assertType.isBoolean(value)
        return value
      }
    })
  })

  it('specify result async function', async () => {
    await testQuestionType({
      ...minimumQuestion,
      show: false,
      result(value) {
        assertType.isBoolean(value)
        return Promise.resolve(value)
      }
    })
  })

  it(`result function receives Prompt as 'this'`, async () => {
    await testQuestionType({
      ...minimumQuestion,
      show: false,
      result(value) {
        assertType<Prompt<boolean>>(this)
        assert(this instanceof Enquirer.Prompt)
        return value
      }
    })
  })

  it.skip('specify validate function', async () => {
    await testQuestionType({
      ...minimumQuestion,
      show: false,
      validate(value) {
        assertType.isBoolean(value)
        return ''
      }
    })
  })

  it('specify validate with boolean function', async () => {
    await testQuestionType({
      ...minimumQuestion,
      show: false,
      validate(value) {
        assertType.isBoolean(value)
        return true
      }
    })
  })

  it('specify validate async boolean function', async () => {
    await testQuestionType({
      ...minimumQuestion,
      show: false,
      validate(value) {
        assertType.isBoolean(value)
        return Promise.resolve(true)
      }
    })
  })

  it(`validate function receives Prompt as 'this'`, async () => {
    await testQuestionType({
      ...minimumQuestion,
      show: false,
      validate() {
        assertType<Prompt<boolean>>(this)
        assert(this instanceof Enquirer.Prompt)
        return true
      }
    })
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
        assertType<boolean | undefined>(value)
        return `(${value})`
      },
      show: false,
    })
  });

  it('specify format async function', async () => {
    await testQuestionType({
      ...minimumQuestion,
      format(value) {
        assertType<boolean | undefined>(value)
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
        assertType<boolean | undefined>(value)
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
    name: 'snippet',
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
      snippet: {
        values,
        result
      }
    })
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
        assertType<string | undefined>(value)
        return value || ''
      },
      show: false,
    })
    assert.ok(called)
  })

  it('specify format async function', async () => {
    await testQuestionType({
      ...minimumQuestion,
      format(value) {
        assertType<string | undefined>(value)
        return Promise.resolve(value || '')
      },
      show: false,
    })
  })

  it(`format function receives Prompt as 'this'`, async () => {
    await testQuestionType({
      ...minimumQuestion,
      format(value) {
        assertType<Prompt<string[]>>(this)
        return value || ''
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
        assertType<string | undefined>(value)
        return value || ''
      },
      show: false,
    })
    assert.ok(called)
  })

  it.skip('specify format async function', async () => {
    await testQuestionType({
      ...minimumQuestion,
      format(value) {
        assertType<string | undefined>(value)
        return Promise.resolve(value || '')
      },
      show: false,
    })
  })

  it.skip(`format function receives Prompt as 'this'`, async () => {
    await testQuestionType({
      ...minimumQuestion,
      format(value) {
        assertType<Prompt<string>>(this)
        return value || ''
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

  it.skip('specify maxSelected', async () => {
    await testQuestionType({
      ...minimumQuestion,
      maxSelected: Infinity,
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
        assertType<string[] | undefined>(value)
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
        assertType<string[] | undefined>(value)
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

describe('autocomplete prompt', () => {
  const minimumQuestion = {
    type: 'autocomplete' as const,
    name: 'flavor',
    message: 'Pick your favorite flavor',
    choices: [
      'Almond',
      'Apple',
      'Banana',
      'Blackberry',
      'Blueberry',
      'Cherry',
      'Chocolate',
      'Cinnamon',
      'Coconut',
      'Cranberry',
      'Grape',
      'Nougat',
      'Orange',
      'Pear',
      'Pineapple',
      'Raspberry',
      'Strawberry',
      'Vanilla',
      'Watermelon',
      'Wintergreen'
    ]
  }

  async function testQuestionType(
    question: Enquirer.prompt.AutoCompleteQuestion.SingleAutoCompleteQuestion,
    expectedAnswer?: string
  ): Promise<void>
  async function testQuestionType(
    question: Enquirer.prompt.AutoCompleteQuestion.MultiAutoCompleteQuestion,
    expectedAnswers?: string[]
  ): Promise<void>
  async function testQuestionType(
    question: Enquirer.prompt.AutoCompleteQuestion,
    expectedAnswer?: string | string[]
  ) {
    expectedAnswer = expectedAnswer || question.multiple ? ['almond'] : 'almond'

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

  it.skip('suggest can be (input, choices) => ChoiceOptions[]', async () => {
    await testQuestionType({
      ...minimumQuestion,
      suggest(input, choices) {
        assertType.isString(input)
        assertType<Enquirer.prompt.SelectQuestion.ChoiceOptions[]>(choices)
        return choices
      },
      show: false
    })
  });

  it.skip('suggest can be (input, choices) => Promise<ChoiceOptions[]>', async () => {
    await testQuestionType({
      ...minimumQuestion,
      async suggest(input, choices) {
        assertType.isString(input)
        assertType<Enquirer.prompt.SelectQuestion.ChoiceOptions[]>(choices)
        return choices
      },
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
        assertType<string | undefined>(value)
        return value || ''
      },
      show: false,
    })
    assert.ok(called)
  })

  it.skip('specify format async function', async () => {

    await testQuestionType({
      ...minimumQuestion,
      format(value) {
        assertType<string | undefined>(value)
        return Promise.resolve(value || '')
      },
      show: false,
    })
  })

  it.skip(`format function receives Prompt as 'this'`, async () => {
    await testQuestionType({
      ...minimumQuestion,
      format(value) {
        assertType<Prompt<string>>(this)
        return value || '' || ''
      },
      show: false,
    })
  })

  it.skip('specify multiple to false is the a single auto complete prompt', async () => {
    await testQuestionType({
      ...minimumQuestion,
      multiple: false,
      format() {
        assertType<Enquirer.Prompt<string>>(this)
        return ''
      },
      show: false
    })
  });

  it.skip('specify multple to true then answer is string[]', async () => {
    await testQuestionType({
      ...minimumQuestion,
      multiple: true,
      format() {
        assertType<Enquirer.Prompt<string[]>>(this)
        return ''
      },
      show: false
    }, ['almond'])
  });
});

describe('custom prompt', () => {
  it('prompt with custom type', () => {
    const { prompt } = Enquirer
    testType(() => prompt({
      name: 'test',
      type: 'foo',
      message: 'asdf',
      format(v) { return v }
    }))
  })

  it('prompt with fuction returns custom type', () => {
    const { prompt } = Enquirer
    testType(() => prompt(() => ({
      name: 'test',
      type: 'foo',
      message: 'asdf',
      format(v) { return v }
    })))
  })

  it('prompt with array of custom types', () => {
    const { prompt } = Enquirer
    testType(() => prompt([
      { type: 'foo', name: 'a', message: 'asdf', initial: 1, format(v) { return v } },
      { type: 'input', name: 'a', message: 'asdf', format(v) { return v || '' } },
    ]))
  })

  it('prompt with array of function returning custom types', () => {
    const { prompt } = Enquirer
    testType(() => prompt([
      function () { return { type: 'foo', name: 'a', message: 'a', initial: 1, format(v: number) { return `some ${v}` } } },
      function () { return { type: 'input', name: 'b', message: 'b', format(v) { return v || '' } } }
    ]))
  })

  it('prompt with mix of question and question functions', () => {
    const { prompt } = Enquirer
    testType(() => prompt([
      { type: 'foo', name: 'a', message: 'asdf', initial: 1, format(v) { return v } },
      function () { return { type: 'foo', name: 'a', message: 'a', initial: 1, format(v: number) { return `some ${v}` } } },
      function () { return { type: 'input', name: 'b', message: 'b', format(v) { return v || '' } } }
    ]))
  })
})

function isPromise(c: any): c is Promise<any> {
  return typeof c.then === 'function'
}
