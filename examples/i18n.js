const I18N = require('../lib/i18n');
let i18n = new I18N();

i18n.language('en');
let fr = i18n.language('fr');

i18n.set('error', 'This is an error');

fr.set('error', 'Ceci est une erreur');

console.log(i18n)
