import keys from './keys'

export default function press(sequence: keyof typeof keys) {
  return keys[sequence] || { name: sequence };
};
