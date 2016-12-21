/**
 * Tests the functions that convert Traffic API responses to GeoJSON.
 */

import { flattenProperties, convertToGeoJsonFeatureCollection } from "../geoJsonUtils";
import { hasAllProperties } from "../CommonUtils";
// Import sample data
import alerts from "./support/Alerts";
import borderCrossings from "./support/BorderCrossings";
import cameras from "./support/Cameras";
import flowDatas from "./support/FlowDatas";
import passConditions from "./support/PassConditions";
import weatherInfo from "./support/WeatherInfo";
import { Alert, BorderCrossingData, Camera, FlowData, PassCondition, WeatherInfo } from "../TravelerInfo";

describe("geoJsonUtils test", () => {
    it("should be able to flatten an object", () => {
        let inputObject = {
            a: 1,
            b: {
                "two": 2,
                "three": 3
            }
        };
        let flattened = flattenProperties(inputObject);
        expect(flattened.a).toEqual(1);
        expect(flattened.b_two).toEqual(2);
        expect(flattened.b_three).toEqual(3);
        expect(flattened.b).toBeUndefined();
    });

    describe("should be able to convert API response to GeoJSON features", () => {


        function convertAndTestFeatures(arr: Alert[] | BorderCrossingData[] | Camera[] | FlowData[] | PassCondition[] | WeatherInfo[]) {
            // Convert input array to GeoJSON Feature Collection.
            let fc = convertToGeoJsonFeatureCollection(arr);
            expect(fc.features.length).toEqual(arr.length, "Input and output should have the same length.");
            // Test each of the features in the output feature collection.
            for (let feature of fc.features) {
                expect(hasAllProperties(feature, "geometry", "type", "properties")).toEqual(true, "Should have all required GeoJSON Feature properties.");
                expect(feature.type).toEqual("Feature", "Array elements should be GeoJSON features.");
                if (feature.id) {
                    let t = typeof feature.id;
                    expect(t === "string" || t === "number").toEqual(true, "If provided, feature's 'id' property should be either string or number.");
                }
            }
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
    });
});