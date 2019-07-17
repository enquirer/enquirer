const crypto = require('crypto');
const base32 = require('hi-base32');
const qrcode = require('qrcode-terminal');

/*
 * Use this function to generate a secret that will
 * be shared with a client app, like Google Authenticator.
 * Then replace the SECRET constant in `./config.js` with
 * the generated secret for this prompt example to run correctly.
 */
function generateSecret(length = 20) {
  const randomBuffer = crypto.randomBytes(length);
  return base32.encode(randomBuffer).replace(/=/g, '');
}

const secret = generateSecret(10);
console.log();
qrcode.generate(`otpauth://totp/example?secret=${secret}`);
console.log(`\nSecret: ${secret}`);
console.log('Use this secret to add a new account in Google Authenticator app. Also, update the value of SECRET in config.js with this new secret.');
