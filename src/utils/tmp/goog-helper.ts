let goog = null;
goog = {};

goog.inherits = function (childCtor, parentCtor) {
    function tempCtor() {}
    tempCtor.prototype = parentCtor.prototype;
    childCtor.superClass_ = parentCtor.prototype;
    childCtor.prototype = new tempCtor();
    childCtor.prototype.constructor = childCtor;

    childCtor.base = function (me, methodName, ...args) {
        return parentCtor.prototype[methodName].apply(me, args);
    };
};

goog.math = {};
goog.asserts = {};

goog.isDef = function (e) {
    return e !== undefined;
};

goog.math.Size = function (e, t) {
    this.width = e;
    this.height = t;
};

goog.isNumber = function (e) {
    return /^\s*-?\d+(\.\d+)?\s*$/.test(e);
};

goog.dom = {};

goog.dom.removeNode = function (node) {
    if (node && node.parentNode) {
        node.parentNode.removeChild(node);
    }
};

goog.math.Coordinate = function (e, t) {
    this.x = goog.isDef(e) ? e : 0;
    this.y = goog.isDef(t) ? t : 0;
};

goog.math.Coordinate.prototype.scale = function (e, t) {
    t = goog.isNumber(t) ? t : e;
    this.x *= e;
    this.y *= t;
    return this;
};

goog.math.Coordinate.difference = function (coord1, coord2) {
    console.log(coord1, coord2);
    return new goog.math.Coordinate(coord1.x - coord2.x, coord1.y - coord2.y);
};

/**
 * @param {T} condition The expression to be asserted as true.
 * @param {string} [message] An optional error message to include if the assertion fails.
 * @throws {Error} Throws an error with the provided message or a default message if the assertion fails.
 */
goog.asserts.assert = function <T>(condition: T, message?: string): asserts condition is T {
    if (!condition) {
        throw new Error(message || 'Assertion failed');
    }
};

/**
 * Creates a size object with the specified width and height.
 *
 * @param {number} width The width of the size object.
 * @param {number} height The height of the size object.
 * @returns {{width: number, height: number}} An object containing width and height properties.
 */
goog.math.Size = function (width: number, height: number): { width: number; height: number } {
    return { width, height };
};

goog.dom.removeNode = (node: Node): Node | null => {
    if (node && node.parentNode) {
        return node.parentNode.removeChild(node);
    }
    return null;
};

/**
 * Name for unsealable tag property.
 * @const @private {string}
 */
goog.UNSEALABLE_CONSTRUCTOR_PROPERTY_ = 'goog_defineClass_legacy_unsealable';

window.goog = goog;

// export const base = goog;
