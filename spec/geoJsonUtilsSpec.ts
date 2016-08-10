import { flattenProperties } from "../geoJsonUtils";
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
});