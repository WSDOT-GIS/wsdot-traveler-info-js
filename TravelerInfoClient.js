/// <reference path="typings/index.d.ts" />
/// <reference path="TravelerInfo.d.ts" />
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    var fetch = typeof window === "undefined" ? require("node-fetch") : window.fetch;
    /**
     * Client for the WSDOT Traveler Information API.
     * @see {@link http://www.wsdot.wa.gov/Traffic/api/}
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
         */
        TravelerInfoClient.prototype.buildApiUrl = function (operation, functionName, searchParams, omitAccessCode) {
            if (functionName === void 0) { functionName = "Get" + operation; }
            if (omitAccessCode === void 0) { omitAccessCode = false; }
            var url = "http://wsdot.wa.gov/Traffic/api/" + operation + "/" + operation + "REST.svc/" + functionName + "AsJson?AccessCode=" + this.accessCode;
            if (searchParams) {
                var searchStringParts = [];
                for (var key in searchParams) {
                    if (searchParams.hasOwnProperty(key)) {
                        var element = searchParams[key];
                        searchStringParts.push(key + "=" + element);
                    }
                }
                var searchString = searchStringParts.join("&");
                url += searchString;
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
                return response.json();
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
         * @returns {Promise.<CVRestrictionData[]>}
         */
        TravelerInfoClient.prototype.getCommercialVehicleRestrictions = function () {
            return this.getJson("CVRestrictions", "GetCommercialVehicleRestrictions");
        };
        /**
         * Gets an alert by ID.
         * @returns {Promise.<Alert>}
         */
        TravelerInfoClient.prototype.getAlert = function (alertId) {
            return this.getJson("HighwayAlerts", "GetAlert", { "AlertID": alertId });
        };
        /**
         * Gets all alerts
         * @returns {Promise<Alert[]>}
         */
        TravelerInfoClient.prototype.getAlerts = function () {
            return this.getJson("HighwayAlerts", "GetAlerts");
        };
        /**
         * Gets alerts by a predefined map area.
         * @param {string} mapArea - The map area.
         * @see {getMapAreas}
         * @returns {Promise<Alert[]>}
         */
        TravelerInfoClient.prototype.getAlertsByMapArea = function (mapArea) {
            return this.getJson("HighwayAlerts", "GetAlertsByMapArea", { MapArea: mapArea });
        };
        TravelerInfoClient.prototype.getEventCategories = function () {
            return this.getJson("HighwayAlerts", "GetEventCategories", undefined, true);
        };
        TravelerInfoClient.prototype.getMapAreas = function () {
            return this.getJson("HighwayAlerts", "GetMapAreas");
        };
        TravelerInfoClient.prototype.searchAlerts = function (stateRoute, region, searchTimeStart, searchTimeEnd, startingMilepost, endingMilepost) {
            return this.getJson("HighwayAlerts", "SearchAlerts", {
                StateRoute: stateRoute,
                Region: region,
                SearchTimeStart: searchTimeStart,
                SearchTimeEnd: searchTimeEnd,
                StartingMilepost: startingMilepost,
                EndingMilepost: endingMilepost
            });
        };
        TravelerInfoClient.prototype.getCamera = function (cameraId) {
            return this.getJson("HighwayCameras", "GetCamera", { "CameraID": cameraId });
        };
        TravelerInfoClient.prototype.getCameras = function () {
            return this.getJson("HighwayCameras", "GetCameras");
        };
        TravelerInfoClient.prototype.getMountainPassCondition = function (passConditionId) {
            return this.getJson("MountainPassConditions", "GetMountainPassCondition", {
                PassConditionId: passConditionId
            });
        };
        TravelerInfoClient.prototype.getMountainPassConditions = function () {
            return this.getJson("MountainPassConditions");
        };
        TravelerInfoClient.prototype.getTrafficFlow = function (flowDataId) {
            return this.getJson("TrafficFlow", undefined, { FlowDataID: flowDataId });
        };
        TravelerInfoClient.prototype.getTrafficFlows = function (flowDataId) {
            return this.getJson("TrafficFlow", "GetTrafficFlows");
        };
        TravelerInfoClient.prototype.getTravelTime = function (travelTimeId) {
            return this.getJson("TravelTimes", "GetTravelTime", {
                TravelTimeID: travelTimeId
            });
        };
        TravelerInfoClient.prototype.getTravelTimes = function () {
            return this.getJson("TravelTimes");
        };
        TravelerInfoClient.prototype.getCurrentWeatherInformation = function (stationId) {
            var functionName = stationId ? "GetCurrentWeatherInformationByStationID" : "GetCurrentWeatherInformation";
            var searchParams = stationId ? { StationID: stationId } : undefined;
            return this.getJson("WeatherInformation", functionName, searchParams);
        };
        TravelerInfoClient.prototype.searchWeatherInformation = function (stationId, searchStartTime, searchEndTime) {
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
