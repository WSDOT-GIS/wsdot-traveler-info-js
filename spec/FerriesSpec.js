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
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = describe("Ferries", function () {
        var client = new FerriesClient_1.default("3a364cc8-0538-48f6-a08b-f1317f95fd7d", typeof window === "object");
        var tripDate = new Date();
        var terminalId = 1;
        var endTerminalId = 10;
        (typeof window !== "undefined" ? xit : it)("should be able to get cache date (disabled in browser)", function (done) {
            client.getCacheFlushDate().then(function (flushDate) {
                expect(flushDate instanceof Date).toBe(true, "The returned value should be a Date object. Actual value is " + flushDate + ".");
                done();
            }, function (error) {
                done.fail(error);
            });
        });
        it("should be able to get valid date range", function (done) {
            var validDateRange = client.getValidDateRange();
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
            var terminals = client.getTerminals(tripDate);
            terminals.then(function (terminals) {
                expect(Array.isArray(terminals)).toBe(true);
                expect(terminals.length).toBeGreaterThan(0);
                done();
            });
            terminals.catch(function (error) {
                done.fail(error);
            });
        });
        it("should be able to get terminal mates", function (done) {
            var terminalMates = client.getTerminalMates(tripDate, terminalId);
            terminalMates.then(function (terminals) {
                expect(Array.isArray(terminals)).toEqual(true);
                done();
            });
            terminalMates.catch(function (error) {
                done.fail(error);
            });
        });
        it("should be able to get terminal combos", function (done) {
            var promise = client.getTerminalCombo(tripDate, terminalId, endTerminalId);
            promise.then(function (terminalCombo) {
                var props = [
                    terminalCombo.ArrivingDescription,
                    terminalCombo.CollectionDescription,
                    terminalCombo.DepartingDescription
                ];
                for (var _i = 0, props_1 = props; _i < props_1.length; _i++) {
                    var prop = props_1[_i];
                    expect(typeof prop).toEqual("string");
                }
                done();
            });
            promise.catch(function (error) {
                done.fail(error);
            });
        });
        it("should be able to get fare line items (basic)", function (done) {
            var promise = client.getFareLineItems(tripDate, terminalId, endTerminalId, true, true);
            promise.then(function (fareLineItems) {
                expect(Array.isArray(fareLineItems)).toEqual(true);
                expect(fareLineItems.length).toBeGreaterThan(0);
                done();
            });
            promise.catch(function (error) {
                done.fail(error);
            });
        });
        it("should be able to get fare line items", function (done) {
            var promise = client.getFareLineItems(tripDate, terminalId, endTerminalId, true, false);
            promise.then(function (fareLineItems) {
                expect(Array.isArray(fareLineItems)).toEqual(true);
                expect(fareLineItems.length).toBeGreaterThan(0);
                done();
            });
            promise.catch(function (error) {
                done.fail(error);
            });
        });
        it("should be able to get verbose fare line items", function (done) {
            var promise = client.getFareLineItemsVerbose(tripDate);
            promise.then(function (vfli) {
                expect(vfli.LineItems).toBeTruthy(vfli.LineItems);
                // expect(vfli.LineItemXref).toBeTruthy(vfli.LineItemXref);
                expect(vfli.RoundTripLineItems).toBeTruthy(vfli.RoundTripLineItems);
                // expect(vfli.TerminalComboVerbose).toBeTruthy(vfli.TerminalComboVerbose);
                done();
            });
            promise.catch(function (error) {
                done.fail(error);
            });
        });
        it("should be able to get fare totals", function (done) {
            var promise = client.getFareTotals(tripDate, terminalId, endTerminalId, true, 1, 1);
            promise.then(function (fareTotals) {
                expect(Array.isArray(fareTotals)).toEqual(true);
                for (var _i = 0, fareTotals_1 = fareTotals; _i < fareTotals_1.length; _i++) {
                    var ft = fareTotals_1[_i];
                    expect(typeof ft.TotalType).toEqual("number");
                    expect(ft.TotalType >= 0 && ft.TotalType <= 4 && ft.TotalType % 1 === 0).toEqual(true, "Fare TotalType should be an integer between 0 and 4.");
                    expect(typeof ft.Description).toEqual("string");
                    expect(typeof ft.BriefDescription).toEqual("string");
                    expect(typeof ft.Amount).toEqual("number");
                }
                done();
            });
            promise.catch(function (error) {
                done.fail(error);
            });
        });
    });
});
