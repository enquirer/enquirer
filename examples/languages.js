const Languages = require('../lib/languages');
let languages = new Languages();

languages.language('en');
let fr = languages.language('fr');

languages.set('error', 'This is an error');

fr.set('error', 'Ceci est une erreur');

console.log(languages)
