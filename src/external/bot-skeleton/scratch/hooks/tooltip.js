import { blueInfo } from '../blocks/images';

window.Blockly.Tooltip.HOVER_MS = 50;

window.Blockly.Tooltip.show_ = () => {
    let params;
    window.Blockly.Tooltip.DIV =
        ((window.Blockly.Tooltip.poisonedElement_ = window.Blockly.Tooltip.element_), window.Blockly.Tooltip.DIV);
    if (!window.Blockly.Tooltip.blocked_) {
        window.Blockly.Tooltip.DIV.innerHTML = '';
        for (params = window.Blockly.Tooltip.element_.tooltip; typeof params === 'function'; ) params = params();
        params = window.Blockly.utils.string.wrap(params, window.Blockly.Tooltip.LIMIT);
        params = params.split('\n');

        params.forEach((param, index) => {
            const div = document.createElement('div');
            const text_span = document.createElement('span');

            text_span.appendChild(document.createTextNode(param));
            text_span.style.verticalAlign = 'middle';
            window.Blockly.Tooltip.DIV.appendChild(div);

            if (!index) {
                const img = document.createElement('img');
                const img_span = document.createElement('span');
                img.src = blueInfo;
                img.style.paddingRight = '8px';
                img.style.verticalAlign = 'middle';
                div.appendChild(img_span);
                img_span.appendChild(img);
            } else {
                text_span.style.paddingLeft = '24px';
            }

            div.appendChild(text_span);
        });

        const direction = window.Blockly.Tooltip.element_.RTL;
        const client_width = document.documentElement.clientWidth;
        const client_height = document.documentElement.clientHeight;
        if (window.Blockly.Tooltip.DIV) {
            window.Blockly.Tooltip.DIV.style.direction = direction ? 'rtl' : 'ltr';
        }
        window.Blockly.Tooltip.DIV.style.display = 'block';
        window.Blockly.Tooltip.visible = true;
        let last_x = window.Blockly.Tooltip.lastX_;
        last_x = direction
            ? last_x - (window.Blockly.Tooltip.OFFSET_X + window.Blockly.Tooltip.DIV.offsetWidth)
            : last_x + window.Blockly.Tooltip.OFFSET_X;
        let last_y = window.Blockly.Tooltip.lastY_ + window.Blockly.Tooltip.OFFSET_Y;
        if (last_y + window.Blockly.Tooltip.DIV.offsetHeight > client_height + window.scrollY) {
            last_y -= window.Blockly.Tooltip.DIV.offsetHeight + 2 * window.Blockly.Tooltip.OFFSET_Y;
        }
        if (direction) {
            last_x = Math.max(window.Blockly.Tooltip.MARGINS - window.scrollX, last_x);
        }
        if (
            last_x + window.Blockly.Tooltip.DIV.offsetWidth >
            client_width + window.scrollX - 2 * window.Blockly.Tooltip.MARGINS
        ) {
            last_x = client_width - window.Blockly.Tooltip.DIV.offsetWidth - 2 * window.Blockly.Tooltip.MARGINS;
        }
        window.Blockly.Tooltip.DIV.style.top = `${last_y}px`;
        window.Blockly.Tooltip.DIV.style.left = `${last_x}px`;
    }
};

window.Blockly.Tooltip.hide = () => {
    if (window.Blockly.Tooltip.visible && window.Blockly.Tooltip.DIV) {
        window.Blockly.Tooltip.visible = false;
        setTimeout(() => (window.Blockly.Tooltip.DIV.style.display = 'none'), window.Blockly.Tooltip.HOVER_MS);
    }
    if (window.Blockly.Tooltip.showPid_) {
        clearTimeout(window.Blockly.Tooltip.showPid_);
    }

    /// For hiding tooltip next to the platform name.
    if (!window.Blockly.Tooltip.DIV?.style.direction) {
        window.Blockly.Tooltip.visible = false;
        window.Blockly.Tooltip.DIV.style.display = 'none';
    }
};
