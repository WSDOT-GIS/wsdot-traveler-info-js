// TODO: create recursive property flattener.

import { hasAllProperties } from "CommonUtils";

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
    let output: any = {};
    for (let k in o) {
        if (o.hasOwnProperty(k) && !(ignoredName && k === ignoredName)) {
            let v = o[k];
            if (typeof v === "object" && !(v instanceof Date)) {
                if (hasAllProperties(v, "Description", "RoadName", "Direction", "MilePost", "Longitude", "Latitude")) {
                    let re = /^End/i;
                    for (let k2 in v) {
                        output[`${re.test(k2) ? "End" : "Start"}${k2}`] = v;
                    }
                } else {
                    for (let k2 in v) {
                        if (v.hasOwnProperty(k2)) {
                            // output[[k, k2].join("_")] = v[k2];
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

/**
 * Examines an object and determines if it should be represented by as a MultiPoint (rather than Point);
 */
function detectMultipoint(input: any): Boolean {
    return input && (input.hasOwnProperty("EndRoadwayLocation") || input.hasOwnProperty("EndPoint"));
}

// function alertToGeometry(alert: Alert) {
//     let geometry: GeoJSON.GeometryObject;
//     if (detectMultipoint(alert)) {
//         let multipoint: GeoJSON.MultiPoint = {
//             type: "MultiPoint",
//             coordinates: [
//                 [alert.StartRoadwayLocation.Longitude, alert.StartRoadwayLocation.Latitude],
//                 [alert.EndRoadwayLocation.Longitude, alert.EndRoadwayLocation.Latitude],
//             ]
//         };
//         geometry = multipoint;
//     } else {
//         let point: GeoJSON.Point = {
//             type: "Point",
//             coordinates: [alert.StartRoadwayLocation.Longitude, alert.EndRoadwayLocation.Latitude]
//         };
//         geometry = point;
//     }
//     return geometry;
// }

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