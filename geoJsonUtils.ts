// TODO: create recursive property flattener.

import { hasAllProperties } from "./CommonUtils";

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



/**
 * "Flattens" the properties of an object so that there are no inner-objects.
 * @param {object} o
 * @param {string} [ignoredName] The name of a property to be ignored. Intended for use with the feature ID.
 */
export function flattenProperties(o: any, ignoredName?: string): any {
    let coordRe = /((?:Lat)|(?:Long))itude$/;
    let output: any = {};
    let position: number[];

    function addRouteLocationPropertiesToObject(output: any, propertyName: string, roadwayLocation: RoadwayLocation) {
        let endRe = /^End/i;
        let prefix = endRe.test(propertyName) ? "End" : "Start";
        for (let k2 in roadwayLocation) {
            if (coordRe) {
                continue;
            }
            output[`${prefix}${k2}`] = roadwayLocation;
        }
        output[`${prefix}Coordinates`] = [roadwayLocation.Longitude, roadwayLocation.Latitude];
    }

    for (let k in o) {
        // Test for (Display)Lat|Longitude property.
        let match = k.match(coordRe);
        if (match) {
            // Create the position array if necessary.
            if (!position) {
                position = [];
            }
            // Assign coordinate to corresponding array element.
            let i = match[1] === "Lat" ? 1 : 0;
            position[i] = o[k];
        } else if (!(ignoredName && k === ignoredName)) {
            let v = o[k];
            if (typeof v === "object" && !(v instanceof Date)) {
                if (hasAllProperties(v, "Description", "RoadName", "Direction", "MilePost", "Longitude", "Latitude")) {
                    addRouteLocationPropertiesToObject(output, k, v);
                } else {
                    for (let k2 in v) {
                        if (v.hasOwnProperty(k2)) {
                            output[`${k}_${k2}`] = v[k2];
                        }
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
 * @property {string} name - The name of the ID property
 * @property {number} value
 */
interface GetIdOutput {
    /** The name of the ID property of the object */
    name: string;
    /** The value of the ID property. */
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
        for (let name in properties) {
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

/**
 * Examines an object and determines if it should be represented by as a MultiPoint (rather than Point);
 */
function detectMultipoint(input: any): Boolean {
    return input && (input.hasOwnProperty("EndRoadwayLocation") || input.hasOwnProperty("EndPoint"));
}

function roadwayLocationToCoordinates(...roadwayLocations: RoadwayLocation[]): [number, number] | [number, number][] | any {
    if (roadwayLocations.length < 1) {

    } else if (roadwayLocations.length > 1) {
        let output: [number, number][] = [];
        for (let l of roadwayLocations) {
            output.push([l.Longitude, l.Latitude]);
        }
        return output;
    } else {
        return [roadwayLocations[0].Longitude, roadwayLocations[0].Latitude];
    }
}

function wsdotToGeometry(input: any) {
    if (!input) {
        throw new TypeError("No input element");
    }

    let type = detectMultipoint(input) ? "MultiPoint" : "Point";

    if (type === "MultiPoint") {
        let startPoint = input.StartRoadwayLocation || input.StartPoint;
        let endPoint = input.EndRoadwayLocation || input.EndPoint;
        let mp: GeoJSON.MultiPoint = {
            type: "MultiPoint",
            coordinates: roadwayLocationToCoordinates(startPoint, endPoint)
        };
    } else {

    }
}

// /**
//  * Converts a traffic API feature into a GeoJSON feature.
//  */
// export function convertToGeoJsonFeature<T extends GeoJSON.GeometryObject>(wsdotFeature: any): GeoJSON.Feature<T> {
//     let idInfo = getId(wsdotFeature);
//     let flattened = flattenProperties(wsdotFeature, idInfo ? idInfo.name : undefined);

//     if (idInfo.name === "AlertID") {
//         let alertGeo = alertToGeometry(wsdotFeature);
//     } else {
//         // Point
//     }
// }