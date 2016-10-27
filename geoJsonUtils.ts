// TODO: create recursive property flattener.

import { hasAllProperties, getPropertyMatching } from "./CommonUtils";

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
    let position: number[] | null = null;

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
export function getId(properties: any): GetIdOutput | null {
    let output: GetIdOutput | null = null;
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

/**
 * Converts a roadway location object to GeoJSON coordinates.
 * @param {...RoadwayLocation} roadwayLocations - Roadway location objects.
 * @returns {(number[] | number[][])} coordinate array(s)
 */
function roadwayLocationToCoordinates(...roadwayLocations: RoadwayLocation[]): [number, number] | [number, number][] | any {
    if (roadwayLocations.length < 1) {
        throw new TypeError("No input provided.");
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

type HasExtractableGeometry = LatLong | Alert | Camera | FlowData | TravelTimeRoute;

/**
 * Extracts the geometry from a Traffic API feature and returns it as a GeoJSON geometry.
 */
function wsdotToGeometry(input: any | HasExtractableGeometry): GeoJSON.Point | GeoJSON.MultiPoint | null {
    if (input === undefined) {
        throw new TypeError("No input provided");
    } else if (input === null) {
        return null;
    }

    let type = detectMultipoint(input) ? "MultiPoint" : "Point";

    if (type === "MultiPoint") {
        let startPoint = input.StartRoadwayLocation || input.StartPoint;
        let endPoint = input.EndRoadwayLocation || input.EndPoint;
        let mp: GeoJSON.MultiPoint = {
            type: "MultiPoint",
            coordinates: roadwayLocationToCoordinates(startPoint, endPoint)
        };
        return mp;
    } else if (hasAllProperties(input, "Latitude", "Longitude")) {
        return {
            type: "Point",
            coordinates: [input.Latitude, input.Longitude]
        };
    } else {
        let {name, location} = getPropertyMatching(input, /Location$/);
        if (hasAllProperties(location, "Latitude", "Longitude")) {
            return {
                type: "Point",
                coordinates: [location.Latitude, location.Longitude]
            };
        } else {
            return null;
        }
    }
}

/**
 * Converts a traffic API feature into a GeoJSON feature.
 */
export function convertToGeoJsonFeature(wsdotFeature: any | HasExtractableGeometry) {
    let idInfo = getId(wsdotFeature);
    let flattened = flattenProperties(wsdotFeature, idInfo !== null ? idInfo.name : undefined);
    let geometry = wsdotToGeometry(wsdotFeature);
    let f: GeoJSON.Feature<GeoJSON.Point> | GeoJSON.Feature<GeoJSON.MultiPoint> | {
        type: "Feature",
        geometry: null,
        properties: any,
        id?: string
    };
    if (geometry !== null) {
        let g2: GeoJSON.Point | GeoJSON.MultiPoint = geometry;
        if (g2.type === "MultiPoint") {
            f = {
                type: "Feature",
                geometry: g2,
                properties: flattened
            };
        } else if (g2.type === "Point") {
            f = {
                type: "Feature",
                geometry: g2,
                properties: flattened
            };
        } else {
            throw new TypeError("Could not convert to GeoJSON feature.");
        }
    } else {
        f = {
            type: "Feature",
            geometry: null,
            properties: flattened
        };
    }
    if (idInfo !== null) {
        f.id = idInfo.value.toString();
    }
    return f;

}