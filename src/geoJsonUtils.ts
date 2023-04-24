import { getPropertyMatching, hasAllProperties } from "./CommonUtils";
import {
  Alert,
  Camera,
  FlowData,
  LatLong,
  RoadwayLocation,
  TravelTimeRoute,
} from "./TravelerInfo";
import { Multipoint, TollRate } from "./WebApi";

import GeoJSON from "geojson";

/**
 * "Flattens" the properties of an object so that there are no inner-objects.
 * @param {object} o
 * @param {string} [ignoredName] The name of a property to be ignored. Intended for use with the feature ID.
 */
export function flattenProperties(o: any, ignoredName?: string): any {
  const coordRe = /((?:Lat)|(?:Long))itude$/;
  const output: any = {};
  let position: number[] | null = null;

  function addRouteLocationPropertiesToObject(
    propOutput: any,
    propertyName: string,
    roadwayLocation: RoadwayLocation
  ) {
    const endRe = /^End/i;
    const prefix = endRe.test(propertyName) ? "End" : "Start";
    for (const k2 in roadwayLocation) {
      if (coordRe) {
        continue;
      }
      propOutput[`${prefix}${k2}`] = roadwayLocation;
    }
    propOutput[`${prefix}Coordinates`] = [
      roadwayLocation.Longitude,
      roadwayLocation.Latitude,
    ];
  }

  for (const k in o) {
    // Test for (Display)Lat|Longitude property.
    const match = k.match(coordRe);
    if (match) {
      // Create the position array if necessary.
      if (!position) {
        position = [];
      }
      // Assign coordinate to corresponding array element.
      const i = match[1] === "Lat" ? 1 : 0;
      position[i] = o[k];
    } else if (!(ignoredName && k === ignoredName)) {
      const v = o[k];
      if (typeof v === "object" && !(v instanceof Date)) {
        if (
          hasAllProperties(
            v,
            "Description",
            "RoadName",
            "Direction",
            "MilePost",
            "Longitude",
            "Latitude"
          )
        ) {
          addRouteLocationPropertiesToObject(output, k, v);
        } else {
          for (const k2 in v) {
            if (Object.hasOwn(v, k2)) {
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
export interface GetIdOutput {
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
    const re =
      /(?:(?:Alert)|(?:Camera)|(?:MountainPass)|(?:FlowData)|(?:TravelTime))ID/i;
    for (const name in properties) {
      if (Object.hasOwn(properties, name) && re.test(name)) {
        output = {
          name,
          value: properties[name],
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
function detectMultipoint(input: object): input is Alert | TravelTimeRoute {
  return (
    input &&
    (Object.hasOwn(input, "EndRoadwayLocation") ||
      Object.hasOwn(input, "EndPoint"))
  );
}

/**
 * Converts a roadway location object to GeoJSON coordinates.
 * @param {...RoadwayLocation} roadwayLocations - Roadway location objects.
 * @returns {(number[] | number[][])} coordinate array(s)
 */
function roadwayLocationToCoordinates(
  ...roadwayLocations: RoadwayLocation[]
): [number, number] | Array<[number, number]> | any {
  if (roadwayLocations.length < 1) {
    throw new TypeError("No input provided.");
  } else if (roadwayLocations.length > 1) {
    const output: Array<[number, number]> = [];
    for (const l of roadwayLocations) {
      output.push([l.Longitude, l.Latitude]);
    }
    return output;
  } else {
    return [roadwayLocations[0].Longitude, roadwayLocations[0].Latitude];
  }
}

export type HasExtractableGeometry =
  | LatLong
  | Alert
  | Camera
  | FlowData
  | TravelTimeRoute
  | TollRate;

/**
 * Extracts the geometry from a Traffic API feature and returns it as a GeoJSON geometry.
 */
function wsdotToGeometry(
  input: any | HasExtractableGeometry
): GeoJSON.Point | GeoJSON.MultiPoint | null {
  if (input === undefined) {
    throw new TypeError("No input provided");
  } else if (input === null) {
    return null;
  }

  const type = detectMultipoint(input) ? "MultiPoint" : "Point";

  if (type === "MultiPoint") {
    const startPoint = input.StartRoadwayLocation || input.StartPoint;
    const endPoint = input.EndRoadwayLocation || input.EndPoint;
    const mp: GeoJSON.MultiPoint = {
      type: "MultiPoint",
      coordinates: roadwayLocationToCoordinates(startPoint, endPoint),
    };
    return mp;
  } else if (hasAllProperties(input, "Latitude", "Longitude")) {
    return {
      type: "Point",
      coordinates: [input.Latitude, input.Longitude],
    };
  } else {
    const { location } = getPropertyMatching(input, /Location$/);
    if (location != null && hasAllProperties(location, "Latitude", "Longitude")) {
      return {
        type: "Point",
        coordinates: [location.Latitude, location.Longitude],
      };
    } else {
      return null;
    }
  }
}

/**
 * Converts a traffic API feature into a GeoJSON feature.
 */
export function convertToGeoJsonFeature(
  wsdotFeature: any | HasExtractableGeometry | Multipoint
) {
  // Detect WebApi response, which does not need flattening.
  if (
    hasAllProperties(
      wsdotFeature,
      "StartLongitude",
      "StartLatitude",
      "EndLongitude",
      "EndLatitude"
    )
  ) {
    const mp = wsdotFeature as Multipoint;
    const geometry: GeoJSON.MultiPoint = {
      type: "MultiPoint",
      coordinates: [
        [mp.StartLongitude, mp.StartLatitude],
        [mp.EndLongitude, mp.EndLatitude],
      ],
    };

    // Copy the properties, excluding coordinates.
    const coordRe = /L(?:(?:ong)|(?:at))itude$/i; // Detects coordinate property names.
    const properties: any = {};
    for (const propName in wsdotFeature) {
      if (coordRe.test(propName)) {
        continue;
      } else if (Object.hasOwn(wsdotFeature, propName)) {
        properties[propName] = wsdotFeature[propName];
      }
    }

    const feature: GeoJSON.Feature<GeoJSON.MultiPoint> = {
      type: "Feature",
      geometry,
      properties,
    };
    return feature;
  } else {
    const idInfo = getId(wsdotFeature);
    const flattened = flattenProperties(
      wsdotFeature,
      idInfo !== null ? idInfo.name : undefined
    );
    const geometry = wsdotToGeometry(wsdotFeature);
    const f: GeoJSON.Feature<typeof flattened> = {
      type: "Feature",
      geometry,
      properties: flattened,
    };
    if (idInfo !== null) {
      f.id = idInfo.value.toString();
    }
    return f;
  }
}

/**
 * Converts an array of Traveler API objects into a GeoJSON feature collection.
 */
export function convertToGeoJsonFeatureCollection(
  wsdotFeatures: any[]
): GeoJSON.FeatureCollection<any> {
  const geoJsonFeatures: Array<GeoJSON.Feature<any>> = [];
  let featureType: string | null = null;
  for (const item of wsdotFeatures) {
    const feature = convertToGeoJsonFeature(item);
    if (featureType === null && feature.geometry !== null) {
      featureType = feature.geometry.type;
    }
    geoJsonFeatures.push(feature);
  }
  return {
    features: geoJsonFeatures,
    type: "FeatureCollection",
  };
}
