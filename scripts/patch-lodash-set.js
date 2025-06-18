// This script patches the lodash.set dependency to use the set function from the full lodash package
// This addresses the Prototype Pollution vulnerability in lodash.set

const fs = require('fs');
const path = require('path');

// Path to the node_modules directory
const nodeModulesPath = path.join(__dirname, '..', 'node_modules');

// Path to the lodash.set directory
const lodashSetPath = path.join(nodeModulesPath, 'lodash.set');

// Check if lodash.set exists
if (fs.existsSync(lodashSetPath)) {
    console.log('Patching lodash.set...');

    // Create a new index.js file that re-exports the set function from lodash
    const patchedContent = `
// This is a patched version of lodash.set that uses the set function from the full lodash package
// This addresses the Prototype Pollution vulnerability in lodash.set
module.exports = require('lodash/set');
`;

    // Write the patched content to the index.js file
    fs.writeFileSync(path.join(lodashSetPath, 'index.js'), patchedContent);

    console.log('Successfully patched lodash.set to use the set function from lodash');
} else {
    console.log('lodash.set not found, skipping patch');
}
