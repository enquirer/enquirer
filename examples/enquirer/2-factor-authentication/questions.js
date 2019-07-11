'use strict';
const { verifyTOTP } = require('./totp');
const config = require('./config');

module.exports = [
  {
    type: 'text',
    name: 'username',
    message: 'Enter your username: ',
    initial: config.USERNAME
  },
  {
    type: 'password',
    name: 'password',
    message: 'Enter your password: ',
    initial: config.PASSWORD,
    validate: () => true
  },
  {
    type: 'text',
    name: 'otp',
    message: 'Enter OTP from Google Authenticator app: ',
    initial: () => '',
    validate: input => {
      return verifyTOTP(input, config.SECRET) ? true : 'Incorrect OTP. Please retry.';
    },
    result: () => 'Correct OTP'
  }
];
