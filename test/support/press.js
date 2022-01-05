import keys from './keys.js';

export default function(sequence = '') {
  return keys[sequence] || { name: sequence };
}
