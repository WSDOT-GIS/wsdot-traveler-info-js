// TODO: create recursive property flattener.

// /**
//  * Converts an object into a valid GeoJSON feature attribute list, with no nested objects.
//  */
// export function flattenProperties(obj: any, rootObj?: any, prefix: string = ""): any {
//     let output = rootObj || {};

//     for (let name in obj) {
//         if (obj.hasOwnProperty(name)) {
//             let value = obj[name];
//             if (typeof value === "object" && !(value instanceof Date)) {
//                 flattenProperties(value, output, `${prefix}${name}_`);
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
export function flattenProperties(o: any, ignoredName?: string): any {
    let output: any = {};
    for (let k in o) {
        if (o.hasOwnProperty(k) && !(ignoredName && k === ignoredName)) {
            let v = o[k];
            if (typeof v === "object" && !(v instanceof Date)) {
                for (let k2 in v) {
                    if (v.hasOwnProperty(k2)) {
                        // output[[k, k2].join("_")] = v[k2];
                        output[`${k}_${k2}`] = v[k2];
                    }
                }
            } else {
                output[k] = v;
            }
        }
    }
    return output;
}

/**
 * @typedef GetIdOutput
 * @type {object}
 * @property {string} name
 * @property {number} value
 */
interface GetIdOutput {
    name: string;
    value: number;
}

/** Checks the list of properties for a property that can be used as an ID.
 * @param {object} properties - An object returned from the traffic API with an ID.
 * @returns {GetIdOutput} - Returns the name of the ID field as well as the ID value.
 */
export function getId(properties: any): GetIdOutput {
    let output: GetIdOutput;
    if (typeof properties === "object") {
        let re = /(?:(?:Alert)|(?:Camera)|(?:MountainPass)|(?:FlowData)|(?:TravelTime))ID/i;
        for (name in properties) {
            if (properties.hasOwnProperty(name) && re.test(name)) {
                output = {
                    name: name,
                    value: properties[name]
                };
                break;
            }
        }
    }
    return output || null;
}