/// <reference path="../typings/index.d.ts" />
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "../FerriesClient"], factory);
    }
})(function (require, exports) {
    "use strict";
    var FerriesClient_1 = require("../FerriesClient");
    describe("Ferries", function () {
        var client = new FerriesClient_1.default("3a364cc8-0538-48f6-a08b-f1317f95fd7d");
        var validDateRange = client.getValidDateRange();
        var terminals = validDateRange.then(function (dateRange) {
            return client.getTerminals(dateRange.DateFrom);
        });
        it("should be able to get cache date", function (done) {
            client.getCacheFlushDate().then(function (flushDate) {
                expect(flushDate instanceof Date).toBe(true);
                done();
            }, function (error) {
                done.fail(error);
            });
        });
        it("should be able to get valid date range", function (done) {
            validDateRange.then(function (dateRange) {
                expect(typeof dateRange).toBe("object", "Expected returned value to be an object.");
                expect(dateRange.DateFrom instanceof Date).toBe(true, "DateFrom should be date");
                expect(dateRange.DateThru instanceof Date).toBe(true, "DateTo should be Date. DateTo = " + dateRange.DateThru);
                done();
            }, function (error) {
                done.fail(error);
            });
        });
        it("should be able to get terminals", function (done) {
            terminals.then(function (terminals) {
                expect(Array.isArray(terminals)).toBe(true);
                expect(terminals.length).toBeGreaterThan(1);
                done();
            });
            terminals.catch(function (error) {
                done.fail(error);
            });
        });
    });
});
