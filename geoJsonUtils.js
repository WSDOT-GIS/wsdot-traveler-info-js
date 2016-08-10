// /**
//  * Converts an object into a valid GeoJSON feature attribute list, with no nested objects.
//  */
// export function flattenObject(obj: any, rootObj?: any, prefix: string = ""): any {
//     let output = rootObj || {};
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    //     for (let name in obj) {
    //         if (obj.hasOwnProperty(name)) {
    //             let value = obj[name];
    //             if (typeof value === "object" && !(value instanceof Date)) {
    //                 flattenObject(value, output, `${prefix}${name}_`);
    //             } else {
    //                 output[name] = value;
    //             }
    //         }
    //     }
    //     return output;
    // }
    /** "Flattens" the properties of an object so that there are no inner-objects.
     * @param {object} o
     * @param {string} [ignoredName] The name of a property to be ignored. Intended for use with the feature ID.
     */
    function flattenProperties(o, ignoredName) {
        var output = {};
        for (var k in o) {
            if (o.hasOwnProperty(k) && !(ignoredName && k === ignoredName)) {
                var v = o[k];
                if (typeof v === "object" && !(v instanceof Date)) {
                    for (var k2 in v) {
                        if (v.hasOwnProperty(k2)) {
                            // output[[k, k2].join("_")] = v[k2];
                            output[(k + "_" + k2)] = v[k2];
                        }
                    }
                }
                else {
                    output[k] = v;
                }
            }
        }
        return output;
    }
    exports.flattenProperties = flattenProperties;
});
