// Jasmine tests for Traveler Info API access functions.

/// <reference types="jasmine" />

jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

import TravelerInfoClient from "../src/TravelerInfoClient";

import { Alert, MapArea, WeatherInfo } from "../src/TravelerInfo";

const apiKey = "3a364cc8-0538-48f6-a08b-f1317f95fd7d";
const client = new TravelerInfoClient(apiKey);

function runGenericTests(response: any[]) {
  expect(Array.isArray(response)).toBe(true, "Response should be an array.");
  expect(response.length).toBeGreaterThan(
    1,
    "Should be at least one item in array."
  );
  let allItemsAreObjects = true;
  for (const item of response) {
    if (typeof item !== "object") {
      allItemsAreObjects = false;
      break;
    }
  }
  expect(allItemsAreObjects).toBe(
    true,
    "All items in array should be an object."
  );
}

describe("Traveler Info API client test", function() {
  it("should be able to retrieve border crossings", function(done) {
    client.getBorderCrossings().then(
      function(response) {
        runGenericTests(response);
        done();
      },
      function(err) {
        done.fail(err);
      }
    );
  });

  it("should be able to get CV Restrictions", function(done) {
    client.getCommercialVehicleRestrictions().then(
      function(response) {
        runGenericTests(response);
        done();
      },
      function(err) {
        done.fail(err);
      }
    );
  });

  describe("alerts", function() {
    const allAlertsPromise = client.getAlerts();

    it("should be able to get map areas", function(done) {
      client.getMapAreas().then(function(mapAreas: MapArea[]) {
        expect(mapAreas.length).toBeGreaterThan(0);
        done();
      });
    });

    it("should be able to get all alerts", function(done) {
      let singleAlertPromise: Promise<Alert>;
      let searchPromise: Promise<Alert[]>;

      allAlertsPromise.then(
        function(response) {
          runGenericTests(response);
          done();
        },
        function(error) {
          done.fail(error);
        }
      );
    });

    it("should be able to get a single alert by ID", function(done) {
      allAlertsPromise.then(function(alerts) {
        client.getAlert(alerts[0].AlertID).then(
          function(alert: Alert) {
            expect(typeof alert).toBe("object");
            done();
          },
          function(error) {
            done.fail(error);
          }
        );
      });
    });

    it("should be able to search for alerts", function(done) {
      allAlertsPromise.then(function(response) {
        const alert: Alert = response[0];
        client
          .searchAlerts(
            alert.StartRoadwayLocation.RoadName,
            alert.Region,
            alert.StartTime,
            new Date(),
            alert.StartRoadwayLocation.MilePost,
            alert.EndRoadwayLocation.MilePost
          )
          .then(function(alerts) {
            expect(Array.isArray(alerts)).toEqual(true);
            done();
          });
      });
    });

    it("should be able to get event categories", function(done) {
      client.getEventCategories().then(
        function(categories) {
          expect(categories.length).toBeGreaterThan(5);
          expect(Array.isArray(categories)).toEqual(true);
          expect(typeof categories[0]).toEqual("string");
          done();
        },
        function(err) {
          done.fail(err);
        }
      );
    });
  });

  describe("Cameras", function() {
    it("should be able to get a list of all cameras", function(done) {
      client
        .getCameras()
        .then(function(cameras) {
          runGenericTests(cameras);
          done();
        })
        .catch(function(error) {
          done.fail(error);
        });
    });

    it("should be able to get a single camera", function(done) {
      client.getCamera("8216").then(
        function(camera) {
          expect(typeof camera).toBe("object");
          done();
        },
        function(error) {
          done.fail(error);
        }
      );
    });
  });

  describe("Mountain Pass Conditions", function() {
    it("should be able to get mountain pass conditions", function(done) {
      client.getMountainPassConditions().then(
        function(conditions) {
          runGenericTests(conditions);
          done();
        },
        function(error) {
          done.fail(error);
        }
      );
    });

    it("should be able to get a single moutain pass condition", function(done) {
      const conditionId = 1;
      client.getMountainPassCondition(conditionId).then(
        function(condition) {
          expect(condition.MountainPassId).toEqual(conditionId);
          done();
        },
        function(error) {
          done.fail(error);
        }
      );
    });
  });

  describe("Traffic Flow", function() {
    it("should be able to get all traffic flow data", function(done) {
      client.getTrafficFlows().then(
        function(flows) {
          runGenericTests(flows);
          done();
        },
        function(error) {
          done.fail(error);
        }
      );
    });

    it("should be able to get single traffic flow data by ID", function(done) {
      const id = 157;
      client.getTrafficFlow(id).then(
        function(flow) {
          expect(flow).toBeTruthy();
          expect(flow.FlowDataID).toEqual(id);
          done();
        },
        function(error) {
          done.fail(error);
        }
      );
    });
  });

  describe("Travel Times", function() {
    it("should be able to get all travel time data", function(done) {
      client.getTravelTimes().then(
        function(flows) {
          runGenericTests(flows);
          done();
        },
        function(error) {
          done.fail(error);
        }
      );
    });

    it("should be able to get single travel time object by ID", function(done) {
      const id = 1;
      client.getTravelTime(id).then(
        function(travelTimeData) {
          expect(travelTimeData).toBeTruthy();
          expect(travelTimeData.TravelTimeID).toEqual(id);
          done();
        },
        function(error) {
          done.fail(error);
        }
      );
    });
  });

  describe("Weather Information", function() {
    it("Should be able to get weather information", function(done) {
      client.getCurrentWeatherInformation().then(
        function(weatherInfos) {
          runGenericTests(weatherInfos);
          // Get the first station ID to ensure a valid ID.
          const stationId = weatherInfos[0].StationID;

          const promise1 = client.getCurrentWeatherInformationById(stationId);
          promise1.then(
            function(weatherInfo: WeatherInfo) {
              expect(weatherInfo.StationID).toEqual(stationId);
            },
            function(error: Error) {
              done.fail(error);
            }
          );

          let startTime: Date, endTime: Date;
          startTime = new Date();
          endTime = new Date(startTime.getTime());
          startTime.setHours(0);
          startTime.setMinutes(0);
          startTime.setSeconds(0);
          startTime.setMilliseconds(0);

          const promise2 = client.searchWeatherInformation(
            stationId,
            startTime,
            endTime
          );
          promise2.then(
            function(searchResults) {
              expect(Array.isArray(searchResults)).toEqual(true);
              if (searchResults.length > 0) {
                expect(searchResults[0].StationID).toEqual(stationId);
              }
            },
            function(error: Error) {
              done.fail(error);
            }
          );

          Promise.all([promise1, promise2]).then(() => {
            done();
          });
        },
        function(error) {
          done.fail(error);
        }
      );
    });

    it("Should be able to get weather station locations", function(done) {
      const promise = client.getCurrentStations();
      promise.then(function(stations) {
        runGenericTests(stations);
        done();
      });
      promise.catch(function(error) {
        done.fail(error);
      });
    });

    it("should be able to get tolling info", done => {
      const promise = client.getTolling();
      promise.then(tollRates => {
        runGenericTests(tollRates);
        for (const tr of tollRates) {
          expect(typeof tr.TripName).toEqual("string");
          expect(typeof tr.CurrentToll).toEqual("number");
          if (tr.CurrentMessage !== null) {
            expect(typeof tr.CurrentMessage).toEqual("string");
          }
          expect(typeof tr.StateRoute).toEqual("string");
          expect(typeof tr.TravelDirection).toEqual("string");
          expect(typeof tr.StartMilepost).toEqual("number");
          expect(typeof tr.StartLongitude).toEqual("number");
          expect(typeof tr.StartLatitude).toEqual("number");
          expect(typeof tr.EndMilepost).toEqual("number");
          expect(typeof tr.EndLongitude).toEqual("number");
          // expect(typeof tr.SignName).toEqual("string" || "undefined");
          expect(typeof tr.EndLatitude).toEqual("number");
        }
        done();
      });
      promise.catch(error => {
        done.fail(error);
      });
    });
  });
});
