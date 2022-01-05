import nodeShims from './lib/shims/node.js';
import createEnquirerClass from './lib/enquirer.js';

export default createEnquirerClass(nodeShims);
