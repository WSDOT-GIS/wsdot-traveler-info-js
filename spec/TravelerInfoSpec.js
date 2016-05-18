/*eslint-env jasmine*/
/// <reference path="../typings/index.d.ts" />

// fetch = require("node-fetch");
let TravelerInfoClient = require("../TravelerInfoClient.js").default;
let apiKey = "3a364cc8-0538-48f6-a08b-f1317f95fd7d";
let client = new TravelerInfoClient(apiKey);

function runGenericTests(response) {
    expect(Array.isArray(response)).toBe(true);
    expect(response.length).toBeGreaterThan(1);
    let allItemsAreObjects = true;
    for (let item of response) {
        if (typeof item !== "object") {
            allItemsAreObjects = false;
            break;
        }
    }
    expect(allItemsAreObjects).toBe(true);
}

describe("Traveler Info API client test", function() {
    it("should be able to retrieve border crossings", function(done){
        client.getBorderCrossings().then(function(response){
            runGenericTests(response);
            done();
        }, function(err){
            done.fail(err);
        });
    });
    
    it("should be able to get CV Restrictions", function(done){
        client.getCommercialVehicleRestrictions().then(function(response){
            runGenericTests(response);
            done();
        }, function (err) {
            done.fail(err);
        });
    });
});