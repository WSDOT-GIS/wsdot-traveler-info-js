/// <amd-module name='TravelerInfoClient' />
/// <reference path="typings/index.d.ts" />
/// <reference path="TravelerInfo.d.ts" />

// To use the Fetch API in node, the node-fetch module is required.
// Older web browsers may require a polyfill.
let fetch = typeof window === "undefined" ? require("node-fetch") : window.fetch;

/**
 * Parses a WCF formatted string.
 * @param {string} dateString - A WCF formatted string.
 * @returns {(Date|string)} If the input is a valid WCF formatted date string, 
 * a Date object will be returned. Otherwise the original string will be returned.
 */
function parseWcfDate(dateString: string): Date | string {
    let wcfDateRe = /^\/Date\((\d+)([+\-]\d+)?\)\/$/i;
    if (typeof dateString === "string") {
        let match: string[] = dateString.match(wcfDateRe);
        if (match) {
            // Remove the whole match, the first item in array.
            // Parse remaining into numbers.
            let numParts: number[] = match.slice(1).map(Number);
            return new Date(numParts[0] + numParts[1]);
        }
    }
    return dateString;
}

/**
 * Provides custom JSON parsing.
 */
function reviver(k: string, v: any): any {
    if (v && typeof v === "string") {
        v = parseWcfDate(v);
    }

    return v;
}

function buildSearchString(searchParams: Object): string {
    if (!searchParams) {
        return null;
    } else {
        let searchStringParts: string[] = [];
        if (searchParams) {
            for (var key in searchParams) {
                if (searchParams.hasOwnProperty(key)) {
                    var element = searchParams[key];
                    if (element != null) {
                        searchStringParts.push(`${key}=${element}`);
                    }
                }
            }
        }
        return searchStringParts.join("&");
    }
}

/**
 * Client for the WSDOT Traveler Information API.
 * @see {@link http://www.wsdot.wa.gov/Traffic/api/}
 */
export default class TravelerInfoClient {
    /**
     * Constructs an API URL.
     * @returns {string} - API URL.
     */
    private buildApiUrl(operation: string, functionName: string = `Get${operation}`, searchParams?: Object, omitAccessCode: boolean = false): string {
        let url = `http://wsdot.wa.gov/Traffic/api/${operation}/${operation}REST.svc/${functionName}AsJson`;
        
        if (!searchParams && !omitAccessCode) {
            searchParams = {
                AccessCode: this.accessCode
            };
        } else if (!omitAccessCode) {
            searchParams["accessCode"] = this.accessCode;
        }
        

        let searchString = buildSearchString(searchParams);
        if (searchString) {
            url = [url, searchString].join("?");
        }
        return url;
    }
    /**
     * Calls a REST endpoint and returns the response as JSON.
     */
    private getJson(operation: string, functionName: string = `Get${operation}`, searchParams?: Object, omitAccessCode: boolean = false): Promise<any> {
        let url = this.buildApiUrl(operation, functionName, searchParams);
        return fetch(url).then(function (response) {
            return response.text();
        }).then(function (s) {
            return JSON.parse(s, reviver);
        });
    }
    /**
     * Creates a new instance of this class
     * @param {string} accessCode - API access code
     */
    constructor(public accessCode: string) {
        if (!this.accessCode || typeof this.accessCode !== "string") {
            throw new TypeError("Invalid access code");
        } else if (!/[a-f0-9\-]+/.test(this.accessCode)) {
            throw new Error("Invalid access code.")
        }
    }
    /**
     * Gets the border crossing information.
     * @returns {BorderCrossingData[]} - An array of border crossing data objects.
     */
    getBorderCrossings(): Promise<BorderCrossingData[]> {
        return this.getJson("BorderCrossings");
    }
    /**
     * Gets Commercial Vehicle Restriction data.
     * @returns {Promise.<CVRestrictionData[]>} - commercial vehicle restriction data.
     */
    getCommercialVehicleRestrictions(): Promise<CVRestrictionData[]> {
        return this.getJson("CVRestrictions", "GetCommercialVehicleRestrictions");
    }
    /**
     * Gets an alert by ID.
     * @returns {Promise.<Alert>} - alert
     */
    getAlert(alertId: Number): Promise<Alert> {
        return this.getJson("HighwayAlerts", "GetAlert", { "AlertID": alertId });
    }
    /**
     * Gets all alerts
     * @returns {Promise.<Alert[]>} - alertsy
     */
    getAlerts(): Promise<Alert[]> {
        return this.getJson("HighwayAlerts", "GetAlerts");
    }
    /**
     * Gets alerts by a predefined map area.
     * @param {string} mapArea - The map area.
     * @see {getMapAreas}
     * @returns {Promise.<Alert[]>} - alerts
     */
    getAlertsByMapArea(mapArea: string | MapArea): Promise<Alert[]> {
        return this.getJson("HighwayAlerts", "GetAlertsByMapArea", {
            MapArea: typeof mapArea === "string" ? mapArea : mapArea.MapArea
        });
    }
    /**
     * Gets alert event categories.
     * @returns {string[]} - Event categories.
     */
    getEventCategories(): Promise<string[]> {
        return this.getJson("HighwayAlerts", "GetEventCategories", undefined, true);
    }
    /**
     * Gets map areas for use with the getAlertsByMapAreas function.
     * @return {Promise.<MapArea[]>} - Map areas.
     */
    getMapAreas(): Promise<MapArea[]> {
        return this.getJson("HighwayAlerts", "GetMapAreas");
    }
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
    searchAlerts(stateRoute: string, region: string, searchTimeStart: Date, searchTimeEnd: Date, startingMilepost: number, endingMilepost: number): Promise<Alert[]> {
        // TODO: figure out how times are supposed to be formatted on the URL.
        return this.getJson("HighwayAlerts", "SearchAlerts", {
            StateRoute: stateRoute,
            Region: region,
            SearchTimeStart: searchTimeStart,
            SearchTimeEnd: searchTimeEnd,
            StartingMilepost: startingMilepost,
            EndingMilepost: endingMilepost
        });
    }
    /**
     * Gets all cameras.
     * @returns {Promise.<Camera[]>} - Array of all cameras.
     */
    getCameras(): Promise<Camera[]> {
        return this.getJson("HighwayCameras", "GetCameras");

    }
    /**
     * Gets one specific camera.
     * @param {string} cameraId - The unique identifier for a camera.
     * @returns {Camera} - The camera that matches the given ID.
     */
    getCamera(cameraId: string): Promise<Camera> {
        return this.getJson("HighwayCameras", "GetCamera", { "CameraID": cameraId });
    }
    getMountainPassConditions(): Promise<PassCondition[]> {
        return this.getJson("MountainPassConditions");
    }
    getMountainPassCondition(passConditionId: number): Promise<PassCondition> {
        var url = this.buildApiUrl("MountainPassConditions", "GetMountainPassCondition", {
           PassConditionId: passConditionId 
        });
        url = url.replace(/AsJson/, "AsJon");
        return fetch(url).then(function(response) {
            return response.text();
        }).then(function (text) {
            return JSON.parse(text, reviver);
        });
    }
    
    getTrafficFlow(flowDataId: number): Promise<FlowData> {
        return this.getJson("TrafficFlow", undefined, { FlowDataID: flowDataId });
    }
    getTrafficFlows(): Promise<FlowData[]> {
        return this.getJson("TrafficFlow", "GetTrafficFlows");
    }
    getTravelTime(travelTimeId: number): Promise<TravelTimeRoute> {
        return this.getJson("TravelTimes", "GetTravelTime", {
            TravelTimeID: travelTimeId
        });
    }
    getTravelTimes(): Promise<TravelTimeRoute[]> {
        return this.getJson("TravelTimes");
    }
    /**
     * Gets current weather information.
     * @returns {Promise.<WeatherInfo[]>} - an array WeatherInfo objects for all stations.
     */
    getCurrentWeatherInformation(): Promise<WeatherInfo[]> {
        return this.getJson("WeatherInformation", "GetCurrentWeatherInformation");
    }
    /**
     * Gets current weather information.
     * @param {string} stationId - Provide a station ID to only return a single weather station's info. Omit to return all.
     * @returns {Promise.<WeatherInfo>} - a single WeatherInfo object. 
     */
    getCurrentWeatherInformationById(stationId: number): Promise<WeatherInfo> {
        let searchParams = { StationID: stationId };
        return this.getJson("WeatherInformation", "GetCurrentWeatherInformationByStationID", searchParams);
    }
    searchWeatherInformation(stationId: number, searchStartTime: Date, searchEndTime: Date): Promise<WeatherInfo> {
        // TODO: Determine how to format time in URL.
        return this.getJson("WeatherInformation", "SearchWeatherInformation", {
            StationID: stationId,
            SearchStartTime: searchStartTime,
            SearchEndTime: searchEndTime
        });
    }
    getCurrentStations(): Promise<WeatherStationData[]> {
        return this.getJson("WeatherStations", "GetCurrentStations");
    }
}