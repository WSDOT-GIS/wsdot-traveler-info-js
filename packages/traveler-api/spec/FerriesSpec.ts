// Unit tests for the Ferries Client functions.

import { DateRange } from "../src/Ferries";
import FerriesClient from "../src/FerriesClient";

export default describe("Ferries", function() {
  const needsClient = Boolean(typeof window === "object");
  const client = new FerriesClient(
    "3a364cc8-0538-48f6-a08b-f1317f95fd7d",
    needsClient,
    undefined
  );
  const tripDate: Date = new Date();
  const terminalId = 1;
  const endTerminalId = 10;

  it("should be able to get cache date", function(done) {
    client.getCacheFlushDate().then(
      function(flushDate) {
        expect(flushDate instanceof Date).toBe(
          true,
          `The returned value should be a Date object. Actual value is ${flushDate}.`
        );
        done();
      },
      function(error) {
        done.fail(error);
      }
    );
  });
  it("should be able to get valid date range", function(done) {
    const validDateRange: Promise<DateRange> = client.getValidDateRange();
    validDateRange.then(
      function(dateRange) {
        expect(typeof dateRange).toBe(
          "object",
          "Expected returned value to be an object."
        );
        expect(dateRange.DateFrom instanceof Date).toBe(
          true,
          `DateFrom should be Date object. DateFrom = ${dateRange.DateFrom}`
        );
        expect(dateRange.DateThru instanceof Date).toBe(
          true,
          `DateTo should be Date object. DateTo = ${dateRange.DateThru}`
        );
        done();
      },
      function(error) {
        done.fail(error);
      }
    );
  });
  it("should be able to get terminals", function(done) {
    const terminals = client.getTerminals(tripDate);
    terminals.then(function(ts) {
      expect(Array.isArray(ts)).toBe(true);
      expect(ts.length).toBeGreaterThan(0);
      done();
    });
    terminals.catch(function(error) {
      done.fail(error);
    });
  });
  it("should be able to get terminal mates", done => {
    const terminalMates = client.getTerminalMates(tripDate, terminalId);
    terminalMates.then(terminals => {
      expect(Array.isArray(terminals)).toEqual(true);
      done();
    });
    terminalMates.catch(error => {
      done.fail(error);
    });
  });
  it("should be able to get terminal combos", done => {
    const promise = client.getTerminalCombo(
      tripDate,
      terminalId,
      endTerminalId
    );

    promise.then(terminalCombo => {
      const props = [
        terminalCombo.ArrivingDescription,
        terminalCombo.CollectionDescription,
        terminalCombo.DepartingDescription
      ];
      for (const prop of props) {
        expect(typeof prop).toEqual("string");
      }
      done();
    });
    promise.catch(error => {
      done.fail(error);
    });
  });

  it("should be able to get fare line items (basic)", done => {
    const promise = client.getFareLineItems(
      tripDate,
      terminalId,
      endTerminalId,
      true,
      true
    );
    promise.then(fareLineItems => {
      expect(Array.isArray(fareLineItems)).toEqual(true);
      expect(fareLineItems.length).toBeGreaterThan(0);
      done();
    });
    promise.catch(error => {
      done.fail(error);
    });
  });
  it("should be able to get fare line items", done => {
    const promise = client.getFareLineItems(
      tripDate,
      terminalId,
      endTerminalId,
      true,
      false
    );
    promise.then(fareLineItems => {
      expect(Array.isArray(fareLineItems)).toEqual(true);
      expect(fareLineItems.length).toBeGreaterThan(0);
      done();
    });
    promise.catch(error => {
      done.fail(error);
    });
  });

  it("should be able to get verbose fare line items", done => {
    const promise = client.getFareLineItemsVerbose(tripDate);
    promise.then(vfli => {
      expect(vfli.LineItems).toBeTruthy(vfli.LineItems);
      // expect(vfli.LineItemXref).toBeTruthy(vfli.LineItemXref);
      expect(vfli.RoundTripLineItems).toBeTruthy(vfli.RoundTripLineItems);
      // expect(vfli.TerminalComboVerbose).toBeTruthy(vfli.TerminalComboVerbose);
      done();
    });
    promise.catch(error => {
      done.fail(error);
    });
  });

  it("should be able to get fare totals", done => {
    const promise = client.getFareTotals(
      tripDate,
      terminalId,
      endTerminalId,
      true,
      1,
      1
    );
    promise.then(fareTotals => {
      expect(Array.isArray(fareTotals)).toEqual(true);
      for (const ft of fareTotals) {
        expect(typeof ft.TotalType).toEqual("number");
        expect(
          ft.TotalType >= 0 && ft.TotalType <= 4 && ft.TotalType % 1 === 0
        ).withContext("Fare TotalType should be an integer between 0 and 4.");
        expect(typeof ft.Description).toEqual("string");
        expect(typeof ft.BriefDescription).toEqual("string");
        expect(typeof ft.Amount).toEqual("number");
      }
      done();
    });
    promise.catch(error => {
      done.fail(error);
    });
  });
});
