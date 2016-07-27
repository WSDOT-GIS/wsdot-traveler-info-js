/*eslint-env jasmine*/
/// <reference path="../typings/index.d.ts" />

jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

import TravelerInfoClient from "../TravelerInfoClient";
let apiKey = "3a364cc8-0538-48f6-a08b-f1317f95fd7d";
let client = new TravelerInfoClient(apiKey);

function runGenericTests(response: Array<any>) {
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

describe("Traveler Info API client test", function () {
    it("should be able to retrieve border crossings", function (done) {
        client.getBorderCrossings().then(function (response) {
            runGenericTests(response);
            done();
        }, function (err) {
            done.fail(err);
        });
    });

    it("should be able to get CV Restrictions", function (done) {
        client.getCommercialVehicleRestrictions().then(function (response) {
            runGenericTests(response);
            done();
        }, function (err) {
            done.fail(err);
        });
    });

    describe("alerts", function () {
        let allAlertsPromise = client.getAlerts();

        it("should be able to get map areas", function (done) {
            client.getMapAreas().then(function (mapAreas: MapArea[]) {
                expect(mapAreas.length).toBeGreaterThan(0);
                done();
            });
        });

        it("should be able to get all alerts", function (done) {
            let singleAlertPromise: Promise<Alert>;
            let searchPromise: Promise<Alert[]>;

            allAlertsPromise.then(function (response) {
                runGenericTests(response);
                done();
            }, function (error) {
                done.fail(error);
            });
        });

        it("should be able to get a single alert by ID", function (done) {
            allAlertsPromise.then(function (alerts) {
                client.getAlert(alerts[0].AlertID).then(function (alert: Alert) {
                    expect(typeof alert).toBe("object");
                    done();
                }, function (error) {
                    done.fail(error);
                });
            });

        });

        it("should be able to search for alerts", function (done) {
            allAlertsPromise.then(function (response) {
                let alert: Alert = response[0];
                client.searchAlerts(alert.StartRoadwayLocation.RoadName,
                    alert.Region,
                    alert.StartTime,
                    new Date(),
                    alert.StartRoadwayLocation.MilePost,
                    alert.EndRoadwayLocation.MilePost
                ).then(function (alerts) {
                    done();
                });
            });
        });

        it("should be able to get event categories", function (done) {
            client.getEventCategories().then(function (categories) {
                expect(categories.length).toBeGreaterThan(5);
                expect(Array.isArray(categories)).toEqual(true);
                expect(typeof categories[0]).toEqual("string");
                done();
            }, function (err) {
                done.fail(err);
            });
        });
    });

    describe("Cameras", function () {
        it("should be able to get a list of all cameras", function (done) {
            client.getCameras().then(function (cameras) {
                runGenericTests(cameras);
                done();
            }).catch(function (error) {
                done.fail(error);
            });
        });

        it("should be able to get a single camera", function (done) {
            client.getCamera("8216").then(function (camera) {
                expect(typeof camera).toBe("object");
                done();
            }, function (error) {
                done.fail(error);
            });
        });
    });

    describe("Mountain Pass Conditions", function () {
        it("should be able to get mountain pass conditions", function (done) {
            client.getMountainPassConditions().then(function (conditions) {
                runGenericTests(conditions);
                done();
            }, function (error) {
                done.fail(error);
            });
        });

        it("should be able to get a single moutain pass condition", function (done) {
            let conditionId = 1;
            client.getMountainPassCondition(conditionId).then(function (condition) {
                expect(condition.MountainPassId).toEqual(conditionId);
                done();
            }, function (error) {
                done.fail(error);
            });
        });
    });

    describe("Traffic Flow", function () {
        it("should be able to get all traffic flow data", function (done) {
            client.getTrafficFlows().then(function (flows) {
                runGenericTests(flows);
                done();
            }, function (error) {
                done.fail(error);
            });
        });

        it("should be able to get single traffic flow data by ID", function (done) {
            let id = 1;
            client.getTrafficFlow(id).then(function (flow) {
                expect(flow).toBeTruthy();
                expect(flow.FlowDataID).toEqual(id);
                done();
            }, function (error) {
                done.fail(error);
            });
        });
    });

    describe("Travel Times", function () {
        it("should be able to get all travel time data", function (done) {
            client.getTravelTimes().then(function (flows) {
                runGenericTests(flows);
                done();
            }, function (error) {
                done.fail(error);
            });
        });

        it("should be able to get single travel time object by ID", function (done) {
            let id = 1;
            client.getTravelTime(id).then(function (travelTimeData) {
                expect(travelTimeData).toBeTruthy();
                expect(travelTimeData.TravelTimeID).toEqual(id);
                done();
            }, function (error) {
                done.fail(error);
            });
        });
    });

    describe("Weather Information", function () {
        it("Should be able to get weather information", function (done) {
            client.getCurrentWeatherInformation().then(function (weatherInfos) {
                runGenericTests(weatherInfos);
                done();
            }, function (error) {
                done.fail(error);
            });
        });

        it("should be able to get weather info for a single station", function (done) {
            let stationId = 1909;
            client.getCurrentWeatherInformationById(stationId).then(function (weatherInfo: WeatherInfo) {
                expect(weatherInfo.StationID).toEqual(stationId);
                done();
            }, function (error: Error) {
                done.fail(error);
            });
        });

        it("should be able to search weather info for a single station", function (done) {
            let stationId = 1909;
            let startTime: Date, endTime: Date;
            startTime = new Date();
            endTime = new Date(startTime.getTime());
            startTime.setHours(0);
            startTime.setMinutes(0);
            startTime.setSeconds(0);
            startTime.setMilliseconds(0);

            client.searchWeatherInformation(stationId, startTime, endTime).then(function (weatherInfos) {
                expect(Array.isArray(weatherInfos)).toEqual(true);
                if (weatherInfos.length > 0) {
                    expect(weatherInfos[0].StationID).toEqual(stationId);
                }
                done();
            }, function (error: Error) {
                done.fail(error);
            });
        });
    });

    it("Should be able to get weather station locations", function (done) {
        let promise = client.getCurrentStations();
        promise.then(function (stations) {
           runGenericTests(stations);
           done();
        });
        promise.catch(function(error){
            done.fail(error);
        });
    });
});