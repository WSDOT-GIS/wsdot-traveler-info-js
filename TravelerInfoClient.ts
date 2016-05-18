/// <reference path="typings/index.d.ts" />
/// <reference path="TravelerInfo.d.ts" />

let fetch = typeof window === "undefined" ? require("node-fetch") : window.fetch;

/**
 * Client for the WSDOT Traveler Information API.
 * @see {@link http://www.wsdot.wa.gov/Traffic/api/}
 */
export default class TravelerInfoClient {
    /**
     * Constructs an API URL.
     */
    private buildApiUrl(operation: string, functionName: string = `Get${operation}`, searchParams?: Object, omitAccessCode: boolean = false): string {
        let url = `http://wsdot.wa.gov/Traffic/api/${operation}/${operation}REST.svc/${functionName}AsJson?AccessCode=${this.accessCode}`
        if (searchParams) {
            let searchStringParts: string[] = []
            for (var key in searchParams) {
                if (searchParams.hasOwnProperty(key)) {
                    var element = searchParams[key];
                    searchStringParts.push(`${key}=${element}`);
                }
            }
            let searchString = searchStringParts.join("&");
            url += searchString;
        }
        return url;
    }
    /**
     * Calls a REST endpoint and returns the response as JSON.
     */
    private getJson(operation: string, functionName: string = `Get${operation}`, searchParams?: Object, omitAccessCode: boolean = false): Promise<any> {
        let url = this.buildApiUrl(operation, functionName, searchParams);
        return fetch(url).then(function (response) {
            return response.json();
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
     * @returns {Promise.<CVRestrictionData[]>}
     */
    getCommercialVehicleRestrictions(): Promise<CVRestrictionData[]> {
        return this.getJson("CVRestrictions", "GetCommercialVehicleRestrictions");
    }
    /**
     * Gets an alert by ID.
     * @returns {Promise.<Alert>}
     */
    getAlert(alertId: string): Promise<Alert> {
        return this.getJson("HighwayAlerts", "GetAlert", { "AlertID": alertId });
    }
    /**
     * Gets all alerts
     * @returns {Promise<Alert[]>}
     */
    getAlerts(): Promise<Alert[]> {
        return this.getJson("HighwayAlerts", "GetAlerts");
    }
    /**
     * Gets alerts by a predefined map area.
     * @param {string} mapArea - The map area.
     * @see {getMapAreas}
     * @returns {Promise<Alert[]>}
     */
    getAlertsByMapArea(mapArea: string): Promise<Alert[]> {
        return this.getJson("HighwayAlerts", "GetAlertsByMapArea", { MapArea: mapArea })
    }
    getEventCategories(): Promise<string[]> {
        return this.getJson("HighwayAlerts", "GetEventCategories", undefined, true);
    }
    getMapAreas(): Promise<string[]> {
        return this.getJson("HighwayAlerts", "GetMapAreas");
    }
    searchAlerts(stateRoute: string, region: string, searchTimeStart: Date, searchTimeEnd: Date, startingMilepost: number, endingMilepost: number): Promise<Alert[]> {
        return this.getJson("HighwayAlerts", "SearchAlerts", {
            StateRoute: stateRoute,
            Region: region,
            SearchTimeStart: searchTimeStart,
            SearchTimeEnd: searchTimeEnd,
            StartingMilepost: startingMilepost,
            EndingMilepost: endingMilepost
        });
    }
    getCamera(cameraId: string): Promise<Camera> {
        return this.getJson("HighwayCameras", "GetCamera", { "CameraID": cameraId });
    }
    getCameras(): Promise<Camera[]> {
        return this.getJson("HighwayCameras", "GetCameras");

    }
    getMountainPassCondition(passConditionId: string): Promise<PassCondition> {
        return this.getJson("MountainPassConditions", "GetMountainPassCondition", {
            PassConditionId: passConditionId
        });
    }
    getMountainPassConditions(): Promise<PassCondition[]> {
        return this.getJson("MountainPassConditions");
    }
    getTrafficFlow(flowDataId: string): Promise<FlowData> {
        return this.getJson("TrafficFlow", undefined, { FlowDataID: flowDataId });
    }
    getTrafficFlows(flowDataId: string): Promise<FlowData[]> {
        return this.getJson("TrafficFlow", "GetTrafficFlows");
    }
    getTravelTime(travelTimeId: string): Promise<TravelTimeRoute> {
        return this.getJson("TravelTimes", "GetTravelTime", {
            TravelTimeID: travelTimeId
        });
    }
    getTravelTimes(): Promise<TravelTimeRoute[]> {
        return this.getJson("TravelTimes");
    }
    getCurrentWeatherInformation(stationId?: string): Promise<WeatherInfo | WeatherInfo[]> {
        let functionName = stationId ? "GetCurrentWeatherInformationByStationID" : "GetCurrentWeatherInformation";
        let searchParams = stationId ? { StationID: stationId } : undefined;
        return this.getJson("WeatherInformation", functionName, searchParams);
    }
    searchWeatherInformation(stationId: string, searchStartTime: Date, searchEndTime: Date): Promise<WeatherInfo[]> {
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