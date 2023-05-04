import { type TollRate, defaultApiRoot, CardinalDirection } from "..";
import { getJsonFromUrl } from "../CommonUtils";
import { LineString } from "geojson";

export type WcfDateString = `/Date(${number}${`-${number}` | ""})/`;

export type TripName = `${number}tp${number}`;

export interface TollTripInfo<
  G extends LineString | string,
  D extends DateObjectOrWcfString
> {
  /**
   * End Latitude
   */
  EndLatitude: number;
  /**
   * End Location Name
   */
  EndLocationName: string;
  /**
   * End Longitude
   */
  EndLongitude: number;
  /**
   * End Milepost
   */
  EndMilepost: number;
  /**
   * Geometry
   */
  Geometry: G;
  /**
   * Modified Date
   */
  ModifiedDate: D;
  /**
   * Start Latitude
   */
  StartLatitude: number;
  /**
   * Start Location Name
   */
  StartLocationName: string;
  /**
   * Start Longitude
   */
  StartLongitude: number;
  /**
   * Start Milepost
   */
  StartMilepost: number;
  /**
   * Travel Direction
   */
  TravelDirection: CardinalDirection;
  /**
   * TripName
   */
  TripName: TripName;
}

export type DateObjectOrWcfString = Date | WcfDateString;

/**
 * Toll version
 */
export interface TollTripVersion<T extends DateObjectOrWcfString> {
  /**
   * Version time stamp
   */
  TimeStamp: T;
  /**
   * Integer version number
   */
  Version: number;
}

export interface TollTrip<T extends DateObjectOrWcfString> {
  Message: `$${TollTrip<T>["Toll"]}`;
  MessageUpdateTime: T;
  Toll: number;
  TripName: TripName;
}

export interface TollTripRate<T extends DateObjectOrWcfString>
  extends Pick<TollTripVersion<T>, "Version"> {
  LastUpdated: T;
  Trips: TollTrip<T>[];
}

export const enum TollOperation {
  TollRates = "TollRates",
  TollTripInfo = "TollTripInfo",
  TollTripRates = "TollTripRates",
  TollTripVersion = "TollTripVersion",
  TripRatesByDate = "TripRatesByDate",
  TripRatesByVersion = "TripRatesByVersion",
}

/**
 * Generates a WSDOT API URL.
 * @param accessCode - access code
 * @param serviceName - service name
 * @param operation - operation
 * @param searchParams - Any other search parameters aside from "AccessCode". Same as {@link URLSearchParams} constructor.
 * @param apiRootUrl - API root URL. If omitted, defaults to https://www.wsdot.wa.gov/Traffic/api/
 * @example
 * ```typescript
 * const rootUrl = new URL("https://www.wsdot.wa.gov/Traffic/api/");
 * const accessCode = "your-access-code";
 * let url = createUrl(accessCode, "TollRates", "TollTripInfo", rootUrl)
 * // Results in the URL "https://www.wsdot.wa.gov/Traffic/api/TollRates/TollRatesREST.svc/GetTollTripInfoAsJson?AccessCode=your-access-code"
 *
 * const dates = {
 *  fromDate: new Date(2022, 0, 1),
 *  toDate: new Date(2022, 2, 1)
 * }
 * url = createUrl(accessCode, "TollRates", "TripRatesByDate", dates, rootUrl)
 * // Results in  http://www.wsdot.wa.gov/Traffic/api/TollRates/TollRatesREST.svc/GetTripRatesByDateAsJson?AccessCode=your-access-code&fromDate=01-01-2022T00:00:00&toDate=03-01-2022T00:00:00
 * ```
 */
export function createUrl(
  accessCode: string,
  serviceName: string,
  operation: TollOperation | string,
  searchParams?: ConstructorParameters<typeof URLSearchParams>[0],
  apiRootUrl = defaultApiRoot
) {
  const newSearchParams = new URLSearchParams(searchParams);
  newSearchParams.set("AccessCode", accessCode);
  const urlString = `${serviceName}/${serviceName}REST.svc/Get${operation}AsJSON?${newSearchParams}`;
  const outUrl = new URL(urlString, apiRootUrl);
  return outUrl;
}

export async function getApiData<T>(
  ...args: Parameters<typeof createUrl>
): Promise<T> {
  const url = createUrl(...args);

  const response = await getJsonFromUrl(url.toString());

  return response;
}

export const getTollRates = async (
  accessCode: string,
  apiUrl: URL = defaultApiRoot
) =>
  await getApiData<TollRate[]>(
    accessCode,
    "TollRates",
    "TollRates",
    undefined,
    apiUrl
  );

export const getTollTripInfo = async (
  accessCode: string,
  apiUrl: URL = defaultApiRoot
) =>
  await getApiData<TollTripInfo<LineString, Date>[]>(
    accessCode,
    "TollRates",
    "TollTripInfo",
    undefined,
    apiUrl
  );
export const getTollTripRates = async (
  accessCode: string,
  apiUrl: URL = defaultApiRoot
) =>
  await getApiData<TollRate[]>(
    accessCode,
    "TollRates",
    "TollTripInfo",
    undefined,
    apiUrl
  );
export const getTollTripVersion = async (
  accessCode: string,
  apiUrl: URL = defaultApiRoot
) =>
  await getApiData<TollRate[]>(
    accessCode,
    "TollRates",
    "TollTripVersion",
    undefined,
    apiUrl
  );
export const getTripRatesByDate = async (
  accessCode: string,
  fromDate: Date,
  toDate: Date,
  apiUrl: URL = defaultApiRoot
) => {
  const dateFormatter = new Intl.DateTimeFormat(undefined, {
    dateStyle: "short",
  });
  const dateParams = (
    [
      ["fromDate", fromDate],
      ["toDate", toDate],
    ] as Array<[string, Date]>
  ).map(([name, value]) => [name, dateFormatter.format(value)]);
  return await getApiData<Record<string, unknown>[]>(
    accessCode,
    "TollRates",
    "TripRatesByDate",
    dateParams,
    apiUrl
  );
};
export const getTripRatesByVersion = async (
  accessCode: string,
  version: string | number,
  apiUrl?: URL
) =>
  await getApiData<TollTripRate<Date>[]>(
    accessCode,
    "TollRates",
    "TripRatesByVersion",
    { version: `${version}` },
    apiUrl
  );

/*
{{ApiRoot}}/TollRates/TollRatesREST.svc/GetTollRatesAsJson?AccessCode={{AccessCode}}
{{ApiRoot}}/TollRates/TollRatesREST.svc/GetTollTripInfoAsJson?AccessCode={{AccessCode}}
{{ApiRoot}}/TollRates/TollRatesREST.svc/GetTollTripRatesAsJson?AccessCode={{AccessCode}}
{{ApiRoot}}/TollRates/TollRatesREST.svc/GetTollTripVersionAsJson?AccessCode={{AccessCode}}
{{ApiRoot}}/TollRates/TollRatesREST.svc/GetTripRatesByDateAsJson?AccessCode={{AccessCode}}&fromDate={{fromDate}}&toDate={{toDate}}
{{ApiRoot}}/TollRates/TollRatesREST.svc/GetTripRatesByVersionAsJson?AccessCode={{AccessCode}}&version={{version}}
*/
