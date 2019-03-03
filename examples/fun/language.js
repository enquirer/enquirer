'use strict';

const { cyan } = require('ansi-colors');
const { Select } = require('enquirer');
const billboard = [
  {
    message: '你喜欢什么语言？',
    name: 'mandarin-chinese'
  },
  {
    message: 'What language do you prefer?',
    name: 'english'
  },
  {
    message: 'आप किस भाषा को पसंद करते हैं?',
    name: 'hindi'
  },
  {
    message: '¿Qué idioma prefieres?',
    name: 'spanish'
  },
  {
    message: 'أي لغة تفضلها؟',
    name: 'arabic'
  },
  {
    message: 'Bahasa apa yang anda suka?',
    name: 'malay'
  },
  {
    message: 'Какой язык вам нравится?',
    name: 'russian'
  },
  {
    message: 'আপনি কি ভাষা পছন্দ করেন?',
    name: 'bangla'
  },
  {
    message: 'Qual idioma você prefere?',
    name: 'portuguese'
  },
  {
    message: 'Quelle langue préférez-vous?',
    name: 'french'
  },
  {
    message: 'Other',
    name: 'other'
  }
];

const frames = (arr, i, max) => {
  let res = arr.slice(i, i + max);
  let n = 0;

  while (res.length < max) {
    res.push(arr[n++]);
  }

  i++;
  return res;
};

const prompt = new Select({
  type: 'select',
  name: 'language',
  message: 'What language do you prefer?',
  timers: { header: 300 },
  header(state) {
    let arr = frames(billboard, state.timer.tick, 7).slice();
    this.state.frame = arr.pop();
    let msgs = arr.map(ele => '  ' + ele.message);
    return msgs.join('\n');
  },
  message() {
    return this.state.frame.message;
  },
  choices: [
    {
      message: '普通話',
      name: 'mandarin-chinese'
    },
    {
      message: 'English',
      name: 'english'
    },
    {
      message: 'हिंदी',
      name: 'hindi'
    },
    {
      message: 'Español',
      name: 'spanish'
    },
    {
      message: 'عربى',
      name: 'arabic'
    },
    {
      message: 'Melayu',
      name: 'malay'
    },
    {
      message: 'русский',
      name: 'russian'
    },
    {
      message: 'বাংলা',
      name: 'bangla'
    },
    {
      message: 'Português',
      name: 'portuguese'
    },
    {
      message: 'français',
      name: 'french'
    },
    {
      message: 'Other',
      name: 'other'
    }
  ]
});

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
