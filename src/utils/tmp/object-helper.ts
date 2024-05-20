/* eslint-disable @typescript-eslint/no-explicit-any */
export const findValueByKeyRecursively = (obj: Record<string, unknown>, key: string) => {
    let return_value;

    Object.keys(obj).some(obj_key => {
        const value = obj[obj_key] as Record<string, unknown>;

        if (obj_key === key) {
            return_value = obj[key];
            return true;
        }

        if (typeof value === 'object') {
            const nested_value = findValueByKeyRecursively(value, key);

            if (nested_value) {
                return_value = nested_value;
                return true;
            }
        }

        return false;
    });

    return return_value;
};

// Recursively freeze an object (deep freeze)
export const deepFreeze = (obj: Record<string, unknown>) => {
    Object.getOwnPropertyNames(obj).forEach(key => {
        const value = obj[key] as Record<string, unknown>;
        if (value && typeof value === 'object' && !Object.isFrozen(value)) {
            deepFreeze(value);
        }
    });
    return Object.freeze(obj);
};

export const isEmptyObject = (obj: Record<string, unknown>) => {
    let is_empty = true;
    if (obj && obj instanceof Object) {
        Object.keys(obj).forEach(key => {
            if (Object.prototype.hasOwnProperty.call(obj, key)) is_empty = false;
        });
    }
    return is_empty;
};

export const cloneObject = (obj: Record<string, unknown>) =>
    !isEmptyObject(obj) ? extend(true, Array.isArray(obj) ? [] : {}, obj) : obj;

export const getPropertyValue = (obj: Record<string, unknown>, k: string | string[]): unknown => {
    let keys = k;
    if (!Array.isArray(keys)) keys = [keys];
    if (!isEmptyObject(obj) && keys[0] in obj && keys && keys.length > 1) {
        return getPropertyValue(obj[keys[0]] as Record<string, unknown>, keys.slice(1));
    }
    // else return clone of object to avoid overwriting data
    return obj ? cloneObject(obj[keys[0]] as Record<string, unknown>) : undefined;
};

function extend(arg0: boolean, arg1: object, obj: Record<string, unknown>) {
    if (arg0) {
        return Object.assign(arg1, obj);
    }
    return { ...arg1, ...obj };
}

export const sequence = (n: number) => Array.from(Array(n).keys());

export const isEqualArray = (arr1: any[], arr2: any[]): boolean =>
    arr1 === arr2 || (arr1.length === arr2.length && arr1.every((value, idx) => isDeepEqual(value, arr2[idx])));

// Note that this function breaks on objects with circular references.
export const isDeepEqual = (a: any, b: any) => {
    if (typeof a !== typeof b) {
        return false;
    } else if (Array.isArray(a)) {
        return isEqualArray(a, b);
    } else if (a && b && typeof a === 'object') {
        return isEqualObject(a, b);
    } else if (typeof a === 'number' && typeof b === 'number' && isNaN(a) && isNaN(b)) {
        return true;
    }
    // else
    return a === b;
};

export const isEqualObject = (obj1: any, obj2: any): boolean =>
    obj1 === obj2 ||
    (Object.keys(obj1).length === Object.keys(obj2).length &&
        Object.keys(obj1).every(key => isDeepEqual(obj1[key], obj2[key])));
