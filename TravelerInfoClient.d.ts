/// <reference path="typings/index.d.ts" />
/// <reference path="TravelerInfo.d.ts" />
/**
 * @class
 * @alias module:TravelerInfoClient
 */
export default class TravelerInfoClient {
    accessCode: string;
    /**
     * Constructs an API URL.
     * @returns {string} - API URL.
     */
    private buildApiUrl(operation, functionName?, searchParams?, omitAccessCode?);
    /**
     * Calls a REST endpoint and returns the response as JSON.
     */
    private getJson(operation, functionName?, searchParams?, omitAccessCode?);
    /**
     * Creates a new instance of this class
     * @param {string} accessCode - API access code
     */
    constructor(accessCode: string);
    /**
     * Gets the border crossing information.
     * @returns {BorderCrossingData[]} - An array of border crossing data objects.
     */
    getBorderCrossings(): Promise<BorderCrossingData[]>;
    /**
     * Gets Commercial Vehicle Restriction data.
     * @returns {Promise.<CVRestrictionData[]>} - commercial vehicle restriction data.
     */
    getCommercialVehicleRestrictions(): Promise<CVRestrictionData[]>;
    /**
     * Gets an alert by ID.
     * @returns {Promise.<Alert>} - alert
     */
    getAlert(alertId: Number): Promise<Alert>;
    /**
     * Gets all alerts
     * @returns {Promise.<Alert[]>} - alertsy
     */
    getAlerts(): Promise<Alert[]>;
    /**
     * Gets alerts by a predefined map area.
     * @param {string} mapArea - The map area.
     * @see {getMapAreas}
     * @returns {Promise.<Alert[]>} - alerts
     */
    getAlertsByMapArea(mapArea: string | MapArea): Promise<Alert[]>;
    /**
     * Gets alert event categories.
     * @returns {string[]} - Event categories.
     */
    getEventCategories(): Promise<string[]>;
    /**
     * Gets map areas for use with the getAlertsByMapAreas function.
     * @return {Promise.<MapArea[]>} - Map areas.
     */
    getMapAreas(): Promise<MapArea[]>;
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
    searchAlerts(stateRoute: string, region: string, searchTimeStart: Date, searchTimeEnd: Date, startingMilepost: number, endingMilepost: number): Promise<Alert[]>;
    /**
     * Gets all cameras.
     * @returns {Promise.<Camera[]>} - Array of all cameras.
     */
    getCameras(): Promise<Camera[]>;
    /**
     * Gets one specific camera.
     * @param {string} cameraId - The unique identifier for a camera.
     * @returns {Promise.<Camera>} - The camera that matches the given ID.
     */
    getCamera(cameraId: string): Promise<Camera>;
    /**
     * Gets mountain pass conditions
     * @returns {Promise.<PassCondition[]>} - Array of pass condition objects.
     */
    getMountainPassConditions(): Promise<PassCondition[]>;
    /**
     * Gets conditions for a single mountain pass.
     * @param {number} passConditionId - Unique identifier for a pass condition.
     * @returns {Promise.<PassCondition>} - A pass condition object.
     */
    getMountainPassCondition(passConditionId: number): Promise<PassCondition>;
    /**
     * Gets traffic flow data for all locations.
     * @returns {Promise.<FlowData[]>} - Traffic flow data.
     */
    getTrafficFlows(): Promise<FlowData[]>;
    getTrafficFlow(flowDataId: number): Promise<FlowData>;
    getTravelTime(travelTimeId: number): Promise<TravelTimeRoute>;
    getTravelTimes(): Promise<TravelTimeRoute[]>;
    /**
     * Gets current weather information.
     * @returns {Promise.<WeatherInfo[]>} - an array WeatherInfo objects for all stations.
     */
    getCurrentWeatherInformation(): Promise<WeatherInfo[]>;
    /**
     * Gets current weather information.
     * @param {string} stationId - Provide a station ID to only return a single weather station's info. Omit to return all.
     * @returns {Promise.<WeatherInfo>} - a single WeatherInfo object.
     */
    getCurrentWeatherInformationById(stationId: number): Promise<WeatherInfo>;
    searchWeatherInformation(stationId: number, searchStartTime: Date, searchEndTime: Date): Promise<WeatherInfo[]>;
    getCurrentStations(): Promise<WeatherStationData[]>;
}
