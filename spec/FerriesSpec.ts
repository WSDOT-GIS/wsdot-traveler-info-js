/// <reference path="../typings/index.d.ts" />

import FerriesClient from "../FerriesClient";

export default describe("Ferries", function () {
    let client = new FerriesClient("3a364cc8-0538-48f6-a08b-f1317f95fd7d");
    let tripDate: Date = new Date();
    let terminalId: number = 1;
    let endTerminalId: number = 10;

    it("should be able to get cache date", function (done) {
        client.getCacheFlushDate().then(function (flushDate) {
            expect(flushDate instanceof Date).toBe(true);
            done();
        }, function (error) {
            done.fail(error);
        });
    });
    it("should be able to get valid date range", function (done) {
        let validDateRange: Promise<DateRange> = client.getValidDateRange();
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
        let terminals = client.getTerminals(tripDate);
        terminals.then(function (terminals) {
            expect(Array.isArray(terminals)).toBe(true);
            expect(terminals.length).toBeGreaterThan(0);
            done();
        });
        terminals.catch(function (error) {
            done.fail(error);
        })
    });
    it("should be able to get terminal mates", (done) => {
        let terminalMates = client.getTerminalMates(tripDate, terminalId);
        terminalMates.then((terminals) => {
            expect(Array.isArray(terminals)).toEqual(true);
            done();
        });
        terminalMates.catch((error) => {
            done.fail(error);
        })
    });
    it("should be able to get terminal combos", (done) => {
        let promise = client.getTerminalCombo(tripDate, terminalId, endTerminalId);

        promise.then((terminalCombo) => {
            let props = [
                terminalCombo.ArrivingDescription,
                terminalCombo.CollectionDescription,
                terminalCombo.DepartingDescription
            ];
            for (let prop of props) {
                expect(typeof prop).toEqual("string");
            }
            done();
        });
        promise.catch((error) => {
            done.fail(error);
        });
    });

    it("should be able to get fare line items (basic)", (done) => {
        let promise = client.getFareLineItems(tripDate, terminalId, endTerminalId, true, true);
        promise.then((fareLineItems) => {
            expect(Array.isArray(fareLineItems)).toEqual(true);
            expect(fareLineItems.length).toBeGreaterThan(0);
            done();
        });
        promise.catch((error) => {
            done.fail(error);
        });
    });
    it("should be able to get fare line items", (done) => {
        let promise = client.getFareLineItems(tripDate, terminalId, endTerminalId, true, false);
        promise.then((fareLineItems) => {
            expect(Array.isArray(fareLineItems)).toEqual(true);
            expect(fareLineItems.length).toBeGreaterThan(0);
            done();
        });
        promise.catch((error) => {
            done.fail(error);
        });
    });

    it("should be able to get verbose fare line items", (done) => {
        let promise = client.getFareLineItemsVerbose(tripDate);
        promise.then((vfli) => {
            done();
        });
        promise.catch((error) => {
            done.fail(error);
        });
    });

    it("should be able to get fare totals", (done) => {
        let promise = client.getFareTotals(tripDate, terminalId, endTerminalId, true, 1, 1);
        promise.then((fareTotals) => {
            expect(Array.isArray(fareTotals)).toEqual(true);
            for (let ft of fareTotals) {
                expect(typeof ft.TotalType).toEqual("number");
                expect(ft.TotalType >= 0 && ft.TotalType <= 4 && ft.TotalType % 1 === 0).toEqual(true, "Fare TotalType should be an integer between 0 and 4.");
                expect(typeof ft.Description).toEqual('string');
                expect(typeof ft.BriefDescription).toEqual('string');
                expect(typeof ft.Amount).toEqual('number');
            }
            done();
        });
        promise.catch((error) => {
            done.fail(error);
        });
    });

});