import * as BlocklyJavaScript from 'blockly/javascript';
import goog from '@/utils/tmp/goog-helper';
import { setColors } from './hooks/colours';

window.goog = goog;

export const loadBlockly = async isDarkMode => {
    const BlocklyModule = await import('blockly');
    window.Blockly = BlocklyModule.default;
    window.Blockly.Colours = {};
    const BlocklyGenerator = new window.Blockly.Generator('code');
    const BlocklyJavaScriptGenerator = {
        ...BlocklyJavaScript,
        ...BlocklyGenerator,
    };
    window.Blockly.JavaScript = BlocklyJavaScriptGenerator;
    window.Blockly.Themes.zelos_renderer = window.Blockly.Theme.defineTheme('zelos_renderer', {
        base: window.Blockly.Themes.Zelos,
        componentStyles: {},
    });
    setColors(isDarkMode);
    await import('./blocks');
    await import('./hooks');
};
