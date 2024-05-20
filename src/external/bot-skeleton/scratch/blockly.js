import BlocklyJS from 'blockly/javascript';

await import('@/utils/tmp/goog-helper');
const Blockly = await import('scratch-blocks/dist/vertical');
console.log('test loadBlockly start', { ...Blockly });
window.Blockly = Blockly;
window.Blockly.JavaScript = BlocklyJS;

await import('./blocks');
import('./hooks');
console.log('test loadBlockly end');
