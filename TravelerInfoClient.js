/// <amd-module name='TravelerInfoClient' />
/// <reference path="TravelerInfo.d.ts" />
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "./CommonUtils"], factory);
    }
})(function (require, exports) {
    "use strict";
    /**
     * Client for the WSDOT Traveler Information API.
     * @see {@link http://www.wsdot.wa.gov/Traffic/api/}
     * @module TravelerInfoClient
     */
    // To use the Fetch API in node, the node-fetch module is required.
    // Older web browsers may require a polyfill.
    var CommonUtils_1 = require("./CommonUtils");
    var fetch = typeof window === "undefined" ? require("node-fetch") : window.fetch;
    /**
     * Provides custom JSON parsing.
     */
    function reviver(k, v) {
        if (v && typeof v === "string") {
            v = CommonUtils_1.parseWcfDate(v);
        }
        return v;
    }
    /**
     * @class
     * @alias module:TravelerInfoClient
     */
    var TravelerInfoClient = (function () {
        /**
         * Creates a new instance of this class
         * @param {string} accessCode - API access code
         */
        function TravelerInfoClient(accessCode) {
            this.accessCode = accessCode;
            if (!this.accessCode || typeof this.accessCode !== "string") {
                throw new TypeError("Invalid access code");
            }
            else if (!/[a-f0-9\-]+/.test(this.accessCode)) {
                throw new Error("Invalid access code.");
            }
        }
        /**
         * Constructs an API URL.
         * @returns {string} - API URL.
         */
        TravelerInfoClient.prototype.buildApiUrl = function (operation, functionName, searchParams, omitAccessCode) {
            if (functionName === void 0) { functionName = "Get" + operation; }
            if (omitAccessCode === void 0) { omitAccessCode = false; }
            var url = "http://wsdot.wa.gov/Traffic/api/" + operation + "/" + operation + "REST.svc/" + functionName + "AsJson";
            if (!searchParams && !omitAccessCode) {
                searchParams = {
                    AccessCode: this.accessCode
                };
            }
            else if (!omitAccessCode) {
                searchParams["accessCode"] = this.accessCode;
            }
            var searchString = CommonUtils_1.buildSearchString(searchParams);
            if (searchString) {
                url = [url, searchString].join("?");
            }
            return url;
        };
        /**
         * Calls a REST endpoint and returns the response as JSON.
         */
        TravelerInfoClient.prototype.getJson = function (operation, functionName, searchParams, omitAccessCode) {
            if (functionName === void 0) { functionName = "Get" + operation; }
            if (omitAccessCode === void 0) { omitAccessCode = false; }
            var url = this.buildApiUrl(operation, functionName, searchParams);
            return fetch(url).then(function (response) {
                return response.text();
            }).then(function (s) {
                try {
                    return JSON.parse(s, reviver);
                }
                catch (e) {
                    if (e instanceof SyntaxError && /Unexpected end of JSON input/i.test(e.message)) {
                        throw new Error("Invalid JSON:\n" + s);
                    }
                }
            });
        };
        /**
         * Gets the border crossing information.
         * @returns {BorderCrossingData[]} - An array of border crossing data objects.
         */
        TravelerInfoClient.prototype.getBorderCrossings = function () {
            return this.getJson("BorderCrossings");
        };
        /**
         * Gets Commercial Vehicle Restriction data.
         * @returns {Promise.<CVRestrictionData[]>} - commercial vehicle restriction data.
         */
        TravelerInfoClient.prototype.getCommercialVehicleRestrictions = function () {
            return this.getJson("CVRestrictions", "GetCommercialVehicleRestrictions");
        };
        /**
         * Gets an alert by ID.
         * @returns {Promise.<Alert>} - alert
         */
        TravelerInfoClient.prototype.getAlert = function (alertId) {
            return this.getJson("HighwayAlerts", "GetAlert", { "AlertID": alertId });
        };
        /**
         * Gets all alerts
         * @returns {Promise.<Alert[]>} - alertsy
         */
        TravelerInfoClient.prototype.getAlerts = function () {
            return this.getJson("HighwayAlerts", "GetAlerts");
        };
        /**
         * Gets alerts by a predefined map area.
         * @param {string} mapArea - The map area.
         * @see {getMapAreas}
         * @returns {Promise.<Alert[]>} - alerts
         */
        TravelerInfoClient.prototype.getAlertsByMapArea = function (mapArea) {
            return this.getJson("HighwayAlerts", "GetAlertsByMapArea", {
                MapArea: typeof mapArea === "string" ? mapArea : mapArea.MapArea
            });
        };
        /**
         * Gets alert event categories.
         * @returns {string[]} - Event categories.
         */
        TravelerInfoClient.prototype.getEventCategories = function () {
            return this.getJson("HighwayAlerts", "GetEventCategories", undefined, true);
        };
        /**
         * Gets map areas for use with the getAlertsByMapAreas function.
         * @return {Promise.<MapArea[]>} - Map areas.
         */
        TravelerInfoClient.prototype.getMapAreas = function () {
            return this.getJson("HighwayAlerts", "GetMapAreas");
        };
        /**
         * Searches for alerts that occur within a specific route segment
         * and date range.
         * @param {string} stateRoute - State Route ID
         * @param {string} region - WSDOT region
         * @param {Date} searchTimeStart - search time start
         * @param {Date} searchTimeEnd - search time end
         * @param {Number} startingMilepost - start milepost
         * @param {Number} endMilepost - end milepost
         * @returns {Promise.<Alert[]>} - An array of alerts that match the search criteria.
         */
        TravelerInfoClient.prototype.searchAlerts = function (stateRoute, region, searchTimeStart, searchTimeEnd, startingMilepost, endingMilepost) {
            // TODO: figure out how times are supposed to be formatted on the URL.
            return this.getJson("HighwayAlerts", "SearchAlerts", {
                StateRoute: stateRoute,
                Region: region,
                SearchTimeStart: searchTimeStart,
                SearchTimeEnd: searchTimeEnd,
                StartingMilepost: startingMilepost,
                EndingMilepost: endingMilepost
            });
        };
        /**
         * Gets all cameras.
         * @returns {Promise.<Camera[]>} - Array of all cameras.
         */
        TravelerInfoClient.prototype.getCameras = function () {
            return this.getJson("HighwayCameras", "GetCameras");
        };
        /**
         * Gets one specific camera.
         * @param {string} cameraId - The unique identifier for a camera.
         * @returns {Promise.<Camera>} - The camera that matches the given ID.
         */
        TravelerInfoClient.prototype.getCamera = function (cameraId) {
            return this.getJson("HighwayCameras", "GetCamera", { "CameraID": cameraId });
        };
        /**
         * Gets mountain pass conditions
         * @returns {Promise.<PassCondition[]>} - Array of pass condition objects.
         */
        TravelerInfoClient.prototype.getMountainPassConditions = function () {
            return this.getJson("MountainPassConditions");
        };
        /**
         * Gets conditions for a single mountain pass.
         * @param {number} passConditionId - Unique identifier for a pass condition.
         * @returns {Promise.<PassCondition>} - A pass condition object.
         */
        TravelerInfoClient.prototype.getMountainPassCondition = function (passConditionId) {
            var url = this.buildApiUrl("MountainPassConditions", "GetMountainPassCondition", {
                PassConditionId: passConditionId
            });
            url = url.replace(/AsJson/, "AsJon");
            return fetch(url).then(function (response) {
                return response.text();
            }).then(function (text) {
                return JSON.parse(text, reviver);
            });
        };
        /**
         * Gets traffic flow data for all locations.
         * @returns {Promise.<FlowData[]>} - Traffic flow data.
         */
        TravelerInfoClient.prototype.getTrafficFlows = function () {
            return this.getJson("TrafficFlow", "GetTrafficFlows");
        };
        TravelerInfoClient.prototype.getTrafficFlow = function (flowDataId) {
            return this.getJson("TrafficFlow", undefined, { FlowDataID: flowDataId });
        };
        TravelerInfoClient.prototype.getTravelTime = function (travelTimeId) {
            return this.getJson("TravelTimes", "GetTravelTime", {
                TravelTimeID: travelTimeId
            });
        };
        TravelerInfoClient.prototype.getTravelTimes = function () {
            return this.getJson("TravelTimes");
        };
        /**
         * Gets current weather information.
         * @returns {Promise.<WeatherInfo[]>} - an array WeatherInfo objects for all stations.
         */
        TravelerInfoClient.prototype.getCurrentWeatherInformation = function () {
            return this.getJson("WeatherInformation", "GetCurrentWeatherInformation");
        };
        /**
         * Gets current weather information.
         * @param {string} stationId - Provide a station ID to only return a single weather station's info. Omit to return all.
         * @returns {Promise.<WeatherInfo>} - a single WeatherInfo object.
         */
        TravelerInfoClient.prototype.getCurrentWeatherInformationById = function (stationId) {
            var searchParams = { StationID: stationId };
            return this.getJson("WeatherInformation", "GetCurrentWeatherInformationByStationID", searchParams);
        };
        TravelerInfoClient.prototype.searchWeatherInformation = function (stationId, searchStartTime, searchEndTime) {
            // TODO: Determine how to format time in URL.
            return this.getJson("WeatherInformation", "SearchWeatherInformation", {
                StationID: stationId,
                SearchStartTime: searchStartTime,
                SearchEndTime: searchEndTime
            });
        };
        TravelerInfoClient.prototype.getCurrentStations = function () {
            return this.getJson("WeatherStations", "GetCurrentStations");
        };
        return TravelerInfoClient;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = TravelerInfoClient;
});
