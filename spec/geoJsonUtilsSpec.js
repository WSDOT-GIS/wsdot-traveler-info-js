(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "../geoJsonUtils"], factory);
    }
})(function (require, exports) {
    "use strict";
    var geoJsonUtils_1 = require("../geoJsonUtils");
    describe("geoJsonUtils test", function () {
        it("should be able to flatten an object", function () {
            var inputObject = {
                a: 1,
                b: {
                    "two": 2,
                    "three": 3
                }
            };
            var flattened = geoJsonUtils_1.flattenProperties(inputObject);
            expect(flattened.a).toEqual(1);
            expect(flattened.b_two).toEqual(2);
            expect(flattened.b_three).toEqual(3);
            expect(flattened.b).toBeUndefined();
        });
    });
});
