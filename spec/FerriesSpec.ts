/// <reference path="../typings/index.d.ts" />

import FerriesClient from "../FerriesClient";

describe("Ferries", function () {
    let client = new FerriesClient("3a364cc8-0538-48f6-a08b-f1317f95fd7d");
    let validDateRange: Promise<DateRange> = client.getValidDateRange();
    let terminals: Promise<Terminal[]> = validDateRange.then(function (dateRange) {
        return client.getTerminals(dateRange.DateFrom);
    })


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
            expect(dateRange.DateThru instanceof Date).toBe(true, `DateTo should be Date. DateTo = ${dateRange.DateThru}`);
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
        terminals.catch(function(error){
            done.fail(error);
        })
    });
});