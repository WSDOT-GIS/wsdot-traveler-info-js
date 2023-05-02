import { type TollRate, defaultApiRoot } from "..";
import { getJsonFromUrl } from "../CommonUtils";

/**
 * Toll version
 */
export interface TollVersion {
  /**
   * Version time stamp
   */
  TimeStamp: Date;
  /**
   * Integer version number
   */
  Version: number;
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
  await getApiData<TollRate[]>(
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
  return await getApiData<TollRate[]>(
    accessCode,
    "TollRates",
    "TripRatesBydate",
    dateParams,
    apiUrl
  );
};
export const getTripRatesByVersion = async (
  accessCode: string,
  version: string,
  apiUrl?: URL
) =>
  await getApiData<TollRate[]>(
    accessCode,
    "TollRates",
    "TripRatesByVersion",
    undefined,
    apiUrl
  );

/*
Uri 	Method 	Description
GetTollRatesAsJson 	GET 	Service at http://www.wsdot.wa.gov/Traffic/api/TollRates/TollRatesREST.svc/GetTollRatesAsJson?AccessCode={ACCESSCODE}
GetTollTripInfoAsJson 	GET 	Service at http://www.wsdot.wa.gov/Traffic/api/TollRates/TollRatesREST.svc/GetTollTripInfoAsJson?AccessCode={ACCESSCODE}
GetTollTripRatesAsJson 	GET 	Service at http://www.wsdot.wa.gov/Traffic/api/TollRates/TollRatesREST.svc/GetTollTripRatesAsJson?AccessCode={ACCESSCODE}
GetTollTripVersionAsJson 	GET 	Service at http://www.wsdot.wa.gov/Traffic/api/TollRates/TollRatesREST.svc/GetTollTripVersionAsJson?AccessCode={ACCESSCODE}
GetTripRatesByDateAsJson 	GET 	Service at http://www.wsdot.wa.gov/Traffic/api/TollRates/TollRatesREST.svc/GetTripRatesByDateAsJson?AccessCode={ACCESSCODE}&fromDate={FROMDATE}&toDate={TODATE}
GetTripRatesByVersionAsJson 	GET 	Service at http://www.wsdot.wa.gov/Traffic/api/TollRates/TollRatesREST.svc/GetTripRatesByVersionAsJson?AccessCode={ACCESSCODE}&version={VERSION}
*/
