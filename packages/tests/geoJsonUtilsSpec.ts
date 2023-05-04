/**
 * Tests the functions that convert Traffic API responses to GeoJSON.
 */

import {
  flattenProperties,
  convertToGeoJsonFeatureCollection
} from "../src/geoJsonUtils";
import { hasAllProperties } from "wsdot-traveler-info";
// Import sample data
import alerts from "wsdot-traveler-info";
import borderCrossings from "wsdot-traveler-info";
import cameras from "wsdot-traveler-info";
import flowDatas from "wsdot-traveler-info";
import passConditions from "wsdot-traveler-info";
import weatherInfo from "wsdot-traveler-info";
import tollRates from "wsdot-traveler-info";
import {
  Alert,
  BorderCrossingData,
  Camera,
  FlowData,
  PassCondition,
  WeatherInfo
} from "../src/TravelerInfo";
import { TollRate } from "wsdot-traveler-info";

describe("geoJsonUtils test", () => {
  it("should be able to flatten an object", () => {
    const inputObject = {
      a: 1,
      b: {
        two: 2,
        three: 3
      }
    };
    const flattened = flattenProperties(inputObject);
    expect(flattened.a).toEqual(1);
    expect(flattened.b_two).toEqual(2);
    expect(flattened.b_three).toEqual(3);
    expect(flattened.b).toBeUndefined();
  });

  describe("should be able to convert API response to GeoJSON features", () => {
    function convertAndTestFeatures(
      arr:
        | Alert[]
        | BorderCrossingData[]
        | Camera[]
        | FlowData[]
        | PassCondition[]
        | WeatherInfo[]
        | TollRate[]
    ) {
      // Convert input array to GeoJSON Feature Collection.
      const fc = convertToGeoJsonFeatureCollection(arr);
      expect(fc.features.length).toEqual(
        arr.length,
        "Input and output should have the same length."
      );
      // Test each of the features in the output feature collection.
      for (const feature of fc.features) {
        expect(
          hasAllProperties(feature, "geometry", "type", "properties")
        ).withContext("Should have all required GeoJSON Feature properties.");
        expect(feature.type).toEqual(
          "Feature",
          "Array elements should be GeoJSON features."
        );
        if (feature.id) {
          const t = typeof feature.id;
          expect(t === "string" || t === "number").toEqual(
            true,
            "If provided, feature's 'id' property should be either string or number."
          );
        }
      }
      return fc;
    }

    // Test each of the sample responses.
    it("should be able to convert alerts to GeoJSON features", () => {
      convertAndTestFeatures(alerts);
    });
    it("should be able to convert borderCrossings to GeoJSON features", () => {
      convertAndTestFeatures(borderCrossings);
    });
    it("should be able to convert cameras to GeoJSON features", () => {
      convertAndTestFeatures(cameras);
    });
    it("should be able to convert flowDatas to GeoJSON features", () => {
      convertAndTestFeatures(flowDatas);
    });
    it("should be able to convert passConditions to GeoJSON features", () => {
      convertAndTestFeatures(passConditions);
    });
    it("should be able to convert weatherInfo to GeoJSON features", () => {
      convertAndTestFeatures(weatherInfo);
    });
    it("should be able to convert TollRates to GeoJSON features", () => {
      convertAndTestFeatures(tollRates);
    });
  });
});
