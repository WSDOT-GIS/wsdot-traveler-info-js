import { flattenProperties, convertToGeoJsonFeature } from "../geoJsonUtils";
import { hasAllProperties } from "../CommonUtils";
import alerts from "./support/Alerts";
import borderCrossings from "./support/BorderCrossings";
import cameras from "./support/Cameras";
import flowDatas from "./support/FlowDatas";
import passConditions from "./support/PassConditions";
import weatherInfo from "./support/WeatherInfo";

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


        let convertFeatures = (arr: any[]) => {
            let features: any[] = [];
            for (let item of arr) {
                let geoJsonFeature = convertToGeoJsonFeature(item);
                expect(hasAllProperties(geoJsonFeature, "geometry", "type", "properties")).toEqual(true, "Should have all required GeoJSON Feature properties.");
                expect(geoJsonFeature.type).toEqual("Feature");
                if (geoJsonFeature.id) {
                    let t = typeof geoJsonFeature.id;
                    expect(t === "string" || t === "number").toEqual(true);
                }
                features.push(geoJsonFeature);
            }
            expect(features.length).toEqual(arr.length);
        };

        it("should be able to convert alerts to GeoJSON features", () => {
            convertFeatures(alerts);
        });
        it("should be able to convert borderCrossings to GeoJSON features", () => {
            convertFeatures(borderCrossings);
        });
        it("should be able to convert cameras to GeoJSON features", () => {
            convertFeatures(cameras);
        });
        it("should be able to convert flowDatas to GeoJSON features", () => {
            convertFeatures(flowDatas);
        });
        it("should be able to convert passConditions to GeoJSON features", () => {
            convertFeatures(passConditions);
        });
        it("should be able to convert weatherInfo to GeoJSON features", () => {
            convertFeatures(weatherInfo);
        });
    });
});