/**
 * Class for an image on a block.
 * @deriv/bot: Blockly implementation vs. Scratch for click handlers
 * @param {string} src The URL of the image.
 * @param {number} width Width of the image.
 * @param {number} height Height of the image.
 * @param {string=} optAlt Optional alt text for when block is collapsed.
 * @param {Function=} optOnClick Optional function to be called when the image
 *     is clicked.  If optOnClick is defined, optAlt must also be defined.
 * @param {boolean=} optFlipRtl Whether to flip the icon in RTL.
 * @extends {window.Blockly.Field}
 * @constructor
 */
window.Blockly.FieldImage = function (src, width, height, optAlt, optOnClick, optFlipRtl, should_collapse) {
    this.sourceBlock_ = null;

    // Ensure height and width are numbers.  Strings are bad at math.
    this.height_ = Number(height);
    this.width_ = Number(width);
    this.size_ = new window.goog.math.Size(this.width_, this.height_);
    this.flipRtl_ = optFlipRtl;
    this.should_collapse_ = should_collapse;
    this.tooltip_ = '';
    this.setValue(src);
    this.setText(optAlt);

    if (typeof optOnClick === 'function') {
        this.clickHandler_ = optOnClick;
    }
};
window.goog.inherits(window.Blockly.FieldImage, window.Blockly.Field);

/**
 * Construct a FieldImage from a JSON arg object,
 * dereferencing any string table references.
 * @param {!Object} options A JSON object with options (src, width, height,
 *    alt, and flipRtl).
 * @return {!window.Blockly.FieldImage} The new field instance.
 * @package
 * @nocollapse
 */
window.Blockly.FieldImage.fromJson = function (options) {
    const src = window.Blockly.utils.replaceMessageReferences(options.src);
    const width = Number(window.Blockly.utils.replaceMessageReferences(options.width));
    const height = Number(window.Blockly.utils.replaceMessageReferences(options.height));
    const alt = window.Blockly.utils.replaceMessageReferences(options.alt);
    const flipRtl = !!options.flipRtl;
    return new window.Blockly.FieldImage(src, width, height, alt, null, flipRtl);
};

/**
 * Editable fields are saved by the XML renderer, non-editable fields are not.
 */
window.Blockly.FieldImage.prototype.EDITABLE = false;

/**
 * Install this image on a block.
 */
window.Blockly.FieldImage.prototype.init = function () {
    if (this.fieldGroup_) {
        // Image has already been initialized once.
        return;
    }
    // Build the DOM.
    /** @type {SVGElement} */
    this.fieldGroup_ = window.Blockly.utils.createSvgElement('g', {}, null);
    if (!this.visible_) {
        this.fieldGroup_.style.display = 'none';
    }
    /** @type {SVGElement} */
    this.imageElement_ = window.Blockly.utils.createSvgElement(
        'image',
        {
            height: `${this.height_}px`,
            width: `${this.width_}px`,
        },
        this.fieldGroup_
    );
    if (this.should_collapse_) {
        this.imageElement_.style.transform = 'rotate(180deg) translate(-16px, -16px)';
    }
    this.setValue(this.src_);
    this.setText(this.text_);
    this.sourceBlock_.getSvgRoot().appendChild(this.fieldGroup_);

    if (this.tooltip_) {
        this.imageElement_.tooltip = this.tooltip_;
    } else {
        // Configure the field to be transparent with respect to tooltips.
        this.setTooltip(this.sourceBlock_);
    }
    window.Blockly.Tooltip.bindMouseEvents(this.imageElement_);

    this.maybeAddClickHandler_();
};

/**
 * Dispose of all DOM objects belonging to this text.
 */
window.Blockly.FieldImage.prototype.dispose = function () {
    window.goog.dom.removeNode(this.fieldGroup_);
    this.fieldGroup_ = null;
    this.imageElement_ = null;
};

/**
 * Bind events for a mouse down on the image, but only if a click handler has
 * been defined. If a click handler is attached to the image, change the cursor to a pointer.
 * @private
 */
window.Blockly.FieldImage.prototype.maybeAddClickHandler_ = function () {
    if (this.clickHandler_ && !this.sourceBlock_.workspace.options.readOnly && !this.sourceBlock_.isInFlyout) {
        this.mouseDownWrapper_ = window.Blockly.bindEventWithChecks_(
            this.fieldGroup_,
            'mousedown',
            this,
            this.clickHandler_
        );
        this.fieldGroup_.style.cursor = 'pointer';
    }
};

/**
 * Change the tooltip text for this field.
 * @param {string|!Element} newTip Text for tooltip or a parent element to
 *     link to for its tooltip.
 */
window.Blockly.FieldImage.prototype.setTooltip = function (newTip) {
    this.tooltip_ = newTip;
    if (this.imageElement_) {
        this.imageElement_.tooltip = newTip;
    }
};

/**
 * Get the source URL of this image.
 * @return {string} Current text.
 * @override
 */
window.Blockly.FieldImage.prototype.getValue = function () {
    return this.src_;
};

/**
 * Set the source URL of this image.
 * @param {?string} src New source.
 * @override
 */
window.Blockly.FieldImage.prototype.setValue = function (src) {
    if (src === null) {
        // No change if null.
        return;
    }
    this.src_ = src;
    if (this.imageElement_) {
        this.imageElement_.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', src || '');
    }
};

/**
 * Get whether to flip this image in RTL
 * @return {boolean} True if we should flip in RTL.
 */
window.Blockly.FieldImage.prototype.getFlipRtl = function () {
    return this.flipRtl_;
};

/**
 * Set the alt text of this image.
 * @param {?string} alt New alt text.
 * @override
 */
window.Blockly.FieldImage.prototype.setText = function (alt) {
    if (alt === null) {
        // No change if null.
        return;
    }
    this.text_ = alt;
    if (this.imageElement_) {
        this.imageElement_.setAttribute('alt', alt || '');
    }
};

/**
 * Images are fixed width, no need to render.
 * @private
 */
window.Blockly.FieldImage.prototype.render_ = function () {
    // NOP
};

/**
 * Images are fixed width, no need to render even if forced.
 */
window.Blockly.FieldImage.prototype.forceRerender = function () {
    // NOP
};

/**
 * Images are fixed width, no need to update.
 * @private
 */
window.Blockly.FieldImage.prototype.updateWidth = function () {
    // NOP
};

/**
 * If field click is called, and click handler defined,
 * call the handler.
 */
window.Blockly.FieldImage.prototype.showEditor_ = function () {
    if (this.clickHandler_) {
        this.clickHandler_(this);
    }
};

window.Blockly.Field.register('field_image', window.Blockly.FieldImage);
