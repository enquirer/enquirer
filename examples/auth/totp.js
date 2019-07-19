'use strict';

const crypto = require('crypto');
const base32 = require('hi-base32');
const AuthPrompt = require('../../lib/types/auth');

async function authenticate(value, state) {
  let secret = await this.resolve(this.options.secret, this);
  return this.verifyTotp(value.otp, secret);
}

const choices = [{ name: 'otp', message: 'OTP from Authenticator app' }];

class TotpAuthPrompt extends AuthPrompt.create(authenticate) {
  constructor(options) {
    super({ ...options, choices });
    this.otpLength = this.options.otpLength || 6;
    this.hmacAlgorithm = this.options.hmacAlgorithm || 'sha1';
    this.timeStepInSeconds = this.options.timeStepInSeconds || 30;
    this.initialTime = this.options.initialTime || 0;
    this.window = this.options.totpVerificationWindow || 1;
  }

  generateHOTP(secret, counter) {
    if (!secret) {
      throw new Error('Secret is required');
    }

    if (!counter) {
      throw new Error('Counter is required');
    }

    const decodedSecret = base32.decode.asBytes(secret);
    const buffer = Buffer.alloc(8);
    for (let i = 0; i < 8; i++) {
      buffer[7 - i] = counter & 0xff;
      counter = counter >> 8;
    }

    // Step 1: Generate an HMAC-SHA-1 value
    const hmac = crypto.createHmac(this.hmacAlgorithm, Buffer.from(decodedSecret));
    hmac.update(buffer);
    const hmacResult = hmac.digest();

    // Step 2: Generate a 4-byte string (Dynamic Truncation)
    const code = this.dynamicTruncationFn(hmacResult);

    // Step 3: Compute an HOTP value
    return code % 10 ** this.otpLength;
  }

  dynamicTruncationFn(hmacValue) {
    const offset = hmacValue[hmacValue.length - 1] & 0xf;
    return (
      ((hmacValue[offset] & 0x7f) << 24) |
      ((hmacValue[offset + 1] & 0xff) << 16) |
      ((hmacValue[offset + 2] & 0xff) << 8) |
      (hmacValue[offset + 3] & 0xff)
    );
  }

  generateTOTP(secret, window = 0) {
    if (!secret) {
      throw new Error('Secret is required');
    }

    const currentTime = Date.now();
    const timeStep = this.timeStepInSeconds * 1000;
    const counter = Math.floor((currentTime - this.initialTime) / timeStep);
    return this.generateHOTP(secret, counter + window);
  }

  verifyTotp(token, secret) {
    try {
      token = parseInt(token, 10);
      if (isNaN(token)) {
        throw new Error();
      }
    } catch (e) {
      return 'Invalid token';
    }

    if (Math.abs(+this.window) > 10) {
      return 'Window size is too large';
    }

    for (let errorWindow = -this.window; errorWindow <= +this.window; errorWindow++) {
      const totp = this.generateTOTP(secret, errorWindow);
      if (token === totp) {
        return 'Correct';
      }
    }
    return 'Incorrect';
  }
}

const prompt = new TotpAuthPrompt({
  name: 'otp',
  message: 'Please enter the OTP from Google Authenticator:',
  secret: '72JTCPPOO2JRL53E',
  validate() {
    if (this.value === 'Correct') {
      return true;
    }
    return this.value;
  }
});

prompt
  .run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
