const { prompt } = require('enquirer');
const { verifyTOTP } = require('./2-factor-authentication/totp');
const config = require('./2-factor-authentication/config');

prompt([
  {
    type: 'text',
    name: 'username',
    message: 'Enter your username: ',
    initial: 'rajat'
  },
  {
    type: 'password',
    name: 'password',
    message: 'Enter your password: ',
    validate: () => true
  }
])
  .then(answer =>
    prompt({
      type: 'toggle',
      name: 'twofactorauth',
      message: 'Do you want to use OTP for additional security?'
    })
      .then(({ twofactorauth }) => {
        if (twofactorauth === true) {
          return prompt({
            type: 'text',
            name: 'otp',
            message: 'Enter OTP from Google Authenticator app: ',
            initial: () => '',
            validate: input => {
              return verifyTOTP(input, config.SECRET) ? true : 'Incorrect OTP. Please retry.';
            },
            result: () => 'Correct OTP'
          })
            .then(console.log)
            .catch(console.log);
        }
        return true;
      })
      .catch(console.log)
  )
  .catch(console.log);
