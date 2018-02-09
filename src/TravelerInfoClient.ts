/**
 * Client for the WSDOT Traveler Information API.
 * @see {@link http://www.wsdot.wa.gov/Traffic/api/}
 * @module TravelerInfoClient
 */

// To use the Fetch API in node, the node-fetch module is required.
// Older web browsers may require a polyfill.
import { buildSearchString, parseWcfDate } from "./CommonUtils";
import {
  Alert,
  BorderCrossingData,
  Camera,
  CVRestrictionData,
  FlowData,
  MapArea,
  PassCondition,
  TravelTimeRoute,
  WeatherInfo,
  WeatherStationData
} from "./TravelerInfo";
import { TollRate } from "./WebApi";

/**
 * Provides custom JSON parsing.
 */
function reviver(k: string, v: any): any {
  if (v && typeof v === "string") {
    v = parseWcfDate(v);
  }

  return v;
}

/**
 * @class
 * @alias module:TravelerInfoClient
 */
export default class TravelerInfoClient {
  /**
   * Creates a new instance of this class
   * @param {string} accessCode - API access code
   * @param {string} [urlBase="http://wsdot.wa.gov/Traffic/api/"] - Base URL. Unless you're using a proxy, you can just use the default value.
   */
  constructor(
    public accessCode: string,
    public urlBase: string = "http://wsdot.wa.gov/Traffic/api/"
  ) {
    if (!this.accessCode || typeof this.accessCode !== "string") {
      throw new TypeError("Invalid access code");
    } else if (!/[a-f0-9\-]+/.test(this.accessCode)) {
      throw new Error("Invalid access code.");
    }
  }

  /**
   * Gets the border crossing information.
   * @returns {BorderCrossingData[]} - An array of border crossing data objects.
   */
  public getBorderCrossings(): Promise<BorderCrossingData[]> {
    return this.getJson("BorderCrossings");
  }
  /**
   * Gets Commercial Vehicle Restriction data.
   * @returns {Promise.<CVRestrictionData[]>} - commercial vehicle restriction data.
   */
  public getCommercialVehicleRestrictions(): Promise<CVRestrictionData[]> {
    return this.getJson("CVRestrictions", "GetCommercialVehicleRestrictions");
  }
  /**
   * Gets an alert by ID.
   * @returns {Promise.<Alert>} - alert
   */
  public getAlert(alertId: number): Promise<Alert> {
    return this.getJson("HighwayAlerts", "GetAlert", { AlertID: alertId });
  }
  /**
   * Gets all alerts
   * @returns {Promise.<Alert[]>} - alerts
   */
  public getAlerts(): Promise<Alert[]> {
    return this.getJson("HighwayAlerts", "GetAlerts");
  }
  /**
   * Gets alerts by a predefined map area.
   * @param {string} mapArea - The map area.
   * @see {getMapAreas}
   * @returns {Promise.<Alert[]>} - alerts
   */
  public getAlertsByMapArea(mapArea: string | MapArea): Promise<Alert[]> {
    return this.getJson("HighwayAlerts", "GetAlertsByMapArea", {
      MapArea: typeof mapArea === "string" ? mapArea : mapArea.MapArea
    });
  }
  /**
   * Gets alert event categories.
   * @returns {string[]} - Event categories.
   */
  public getEventCategories(): Promise<string[]> {
    return this.getJson("HighwayAlerts", "GetEventCategories", undefined, true);
  }
  /**
   * Gets map areas for use with the getAlertsByMapAreas function.
   * @return {Promise.<MapArea[]>} - Map areas.
   */
  public getMapAreas(): Promise<MapArea[]> {
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
  public searchAlerts(
    stateRoute: string,
    region: string,
    searchTimeStart: Date,
    searchTimeEnd: Date,
    startingMilepost: number,
    endingMilepost: number
  ): Promise<Alert[]> {
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
  public getCameras(): Promise<Camera[]> {
    return this.getJson("HighwayCameras", "GetCameras");
  }
  /**
   * Gets one specific camera.
   * @param {string} cameraId - The unique identifier for a camera.
   * @returns {Promise.<Camera>} - The camera that matches the given ID.
   */
  public getCamera(cameraId: string): Promise<Camera> {
    return this.getJson("HighwayCameras", "GetCamera", { CameraID: cameraId });
  }
  /**
   * Gets mountain pass conditions
   * @returns {Promise.<PassCondition[]>} - Array of pass condition objects.
   */
  public getMountainPassConditions(): Promise<PassCondition[]> {
    return this.getJson("MountainPassConditions");
  }
  /**
   * Gets conditions for a single mountain pass.
   * @param {number} passConditionId - Unique identifier for a pass condition.
   * @returns {Promise.<PassCondition>} - A pass condition object.
   */
  public getMountainPassCondition(
    passConditionId: number
  ): Promise<PassCondition> {
    let url = this.buildApiUrl(
      "MountainPassConditions",
      "GetMountainPassCondition",
      {
        PassConditionId: passConditionId
      }
    );
    url = url.replace(/AsJson/, "AsJon");
    return fetch(url)
      .then(function(response: Response) {
        return response.text();
      })
      .then(function(text: string) {
        return JSON.parse(text, reviver);
      });
  }

  /**
   * Gets traffic flow data for all locations.
   * @returns {Promise.<FlowData[]>} - Traffic flow data.
   */
  public getTrafficFlows(): Promise<FlowData[]> {
    return this.getJson("TrafficFlow", "GetTrafficFlows");
  }
  public getTrafficFlow(flowDataId: number): Promise<FlowData> {
    return this.getJson("TrafficFlow", undefined, { FlowDataID: flowDataId });
  }
  public getTravelTime(travelTimeId: number): Promise<TravelTimeRoute> {
    return this.getJson("TravelTimes", "GetTravelTime", {
      TravelTimeID: travelTimeId
    });
  }
  public getTravelTimes(): Promise<TravelTimeRoute[]> {
    return this.getJson("TravelTimes");
  }
  /**
   * Gets current weather information.
   * @returns {Promise.<WeatherInfo[]>} - an array WeatherInfo objects for all stations.
   */
  public getCurrentWeatherInformation(): Promise<WeatherInfo[]> {
    return this.getJson("WeatherInformation", "GetCurrentWeatherInformation");
  }
  /**
   * Gets current weather information.
   * @param {string} stationId - Provide a station ID to only return a single weather station's info. Omit to return all.
   * @returns {Promise.<WeatherInfo>} - a single WeatherInfo object.
   */
  public getCurrentWeatherInformationById(
    stationId: number
  ): Promise<WeatherInfo> {
    const searchParams = { StationID: stationId };
    return this.getJson(
      "WeatherInformation",
      "GetCurrentWeatherInformationByStationID",
      searchParams
    );
  }
  public searchWeatherInformation(
    stationId: number,
    searchStartTime: Date,
    searchEndTime: Date
  ): Promise<WeatherInfo[]> {
    // TODO: Determine how to format time in URL.
    return this.getJson("WeatherInformation", "SearchWeatherInformation", {
      StationID: stationId,
      SearchStartTime: searchStartTime,
      SearchEndTime: searchEndTime
    });
  }
  public getCurrentStations(): Promise<WeatherStationData[]> {
    return this.getJson("WeatherStations", "GetCurrentStations");
  }
  /**
   * Gets tolling information.
   */
  public getTolling(): Promise<TollRate[]> {
    return this.getJson("tolling");
  }

  /**
   * Constructs an API URL.
   * @returns {string} - API URL.
   */
  private buildApiUrl(
    operation: string,
    functionName: string = `Get${operation}`,
    searchParams?: any,
    omitAccessCode: boolean = false
  ): string {
    let url: string;
    const webApiOperationsRe = /tolling/i;
    if (webApiOperationsRe.test(operation)) {
      url = `${this.urlBase}/api/${operation}`;
    } else {
      url = `${
        this.urlBase
      }${operation}/${operation}REST.svc/${functionName}AsJson`;
    }

    if (!searchParams && !omitAccessCode) {
      searchParams = {
        AccessCode: this.accessCode
      };
    } else if (!omitAccessCode) {
      searchParams.accessCode = this.accessCode;
    }

    const searchString = buildSearchString(searchParams);
    if (searchString) {
      url = [url, searchString].join("?");
    }
    return url;
  }
  /**
   * Calls a REST endpoint and returns the response as JSON.
   */
  private async getJson(
    operation: string,
    functionName: string = `Get${operation}`,
    searchParams?: object,
    omitAccessCode: boolean = false
  ): Promise<any> {
    const url = this.buildApiUrl(operation, functionName, searchParams);
    const response = await fetch(url);
    const s = await response.text();
    try {
      return JSON.parse(s, reviver);
    } catch (e) {
      if (
        e instanceof SyntaxError &&
        /Unexpected end of JSON input/i.test(e.message)
      ) {
        throw new Error(`Invalid JSON:\n${s}`);
      }
    }
  }
}
