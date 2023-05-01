/**
 * Provides common functions for other modules.
 * @module CommonUtils
 */

import type { RoadwayLocation } from "./TravelerInfo";

/**
 * Determines if the input value is a {@link RoadwayLocation}
 * @param v 
 * @returns 
 */
export function isRoadwayLocation(v: unknown): v is RoadwayLocation {
  return hasAllProperties(
    v,
    "Description",
    "RoadName",
    "Direction",
    "MilePost",
    "Longitude",
    "Latitude"
  );
}

/**
 * Matches the date format string used by WCF services.
 */
export const wcfDateRe = /^\/Date\((\d+)([+-]\d+)?\)\/$/i;

/**
 * Converts a HTTP fetch Response to JSON.
 * @param response - HTTP fetch response
 * @returns Promise with parsed JSON object.
 */
export async function responseToJson(response: Response) {
  const reviver = function (k: string, v: unknown) {
    if (v && typeof v === "string") {
      return parseWcfDate(v);
    }
    return v;
  };

  const text = await response.text();
  // identifier (otherstuff);string
  const re = /^\s*\w+\s*\((?<parenContents>.+?)\);?\s*$/;
  const match = text.match(re);
  if (match) {
    return JSON.parse(match[1], reviver);
  } else {
    return JSON.parse(text, reviver);
  }
}

/**
 * Submits a JSONP request via a temporarily added script tag.
 * @param url - JSONP request URL
 * @returns - parsed JSON response
 */
export function getJsonP(url: string, callbackProperty: string = "wsdot_ferries_callback") {
  return new Promise(function (resolve, reject) {
    const scriptTag = document.createElement("script");

    (window as typeof window & Record<string, unknown>)[callbackProperty] = function (json: string | Record<string, unknown> | Date) {
      document.head.removeChild(scriptTag);
      try {
        if (typeof json === "string") {
          json = parseWcfDate(json);
        } else if (typeof json === "object" && !(json instanceof Date) ) {
          convertObjectProperties(json);
        }
        resolve(json);
      } catch (e) {
        reject(e);
      }
    };

    scriptTag.src = url;

    document.head.appendChild(scriptTag);
  });
}

/**
 * Makes JSON request (detecting if JSONP is necessary based on URL)
 * and parses output to an object.
 * @param {string} url - request URL
 * @returns {Promise.<Object>} - Parsed JSON response object promise
 */
export function getJsonFromUrl(url: string) {
  if (/&callback/.test(url)) {
    const callbackProperty = new URL(url).searchParams.get("callback")
    return getJsonP(url, callbackProperty ?? undefined);
  } else {
    return fetch(url).then(responseToJson);
  }
}

/**
 * Parses a WCF formatted string.
 * @param {string} dateString - A WCF formatted string.
 * @returns {(Date|string)} If the input is a valid WCF formatted date string,
 * a Date object will be returned. Otherwise the original string will be returned.
 */
export function parseWcfDate(dateString: string): Date | string {
  if (typeof dateString === "string") {
    const match = dateString.match(wcfDateRe);
    if (match) {
      // Remove the whole match, the first item in array.
      // Parse remaining into numbers.
      const numParts: number[] = match.slice(1).map(Number);
      return new Date(numParts[0] + numParts[1]);
    }
  }
  return dateString;
}

/**
 * Converts a date into a WCF formatted date string.
 * @param {Date} date - A date
 * @returns {string} WCF date string.
 */
export function toWcfDate(date: Date): string {
  return `/Date(${date.getTime()})/`;
}

/**
 * Builds a search string.
 * @param {?Object} searchParams - Search parameters.
 * @returns {string} search string for URL
 */
export function buildSearchString(
  searchParams?: Record<string, string | number | boolean | Date>
): string | null {
  if (!searchParams) {
    return null;
  } else {
    const searchStringParts: string[] = [];
    if (searchParams) {
      for (const key in searchParams) {
        if (Object.hasOwn(searchParams, key)) {
          let val = searchParams[key];
          if (val != null) {
            if (val instanceof Date) {
              val = val.toISOString();
            }
            searchStringParts.push(
              `${encodeURIComponent(key)}=${encodeURIComponent(val)}`
            );
          }
        }
      }
    }
    return searchStringParts.join("&");
  }
}

/**
 * Converts properties of an object. E.g., converts Wcf date strings into Date objects.
 * @param {Object} o - an object.
 */
export function convertObjectProperties(o: Record<string, unknown>): void {
  for (const key in o) {
    if (Object.hasOwn(o, key)) {
      const value = o[key];
      if (typeof value === "string" && value.length > 8) {
        o[key] = parseWcfDate(value);
      } else if (typeof value === "object") {
        convertObjectProperties(value as typeof o);
      }
    }
  }
}

/**
 * Determines if an object has properties matching ALL of the given names.
 * @param {object} o - An object
 * @param {...string} propertyNames - Names of properties to look for.
 * @returns {boolean} returns true if object has all named properties, false otherwise.
 */
export function hasAllProperties(
  o: unknown,
  ...propertyNames: string[]
): boolean {
  if (o == null) {
    return false;
  }
  let allFound = true;
  for (const n of propertyNames) {
    allFound = allFound && Object.hasOwn(o, n);
    if (!allFound) {
      break;
    }
  }
  return allFound;
}

/**
 * Gets the property name and value that matches the given Regexp.
 */
export function getPropertyMatching(
  o: Record<string, unknown>,
  propertyNameRegexp: RegExp
) {
  let name: string | null = null;
  let location: RoadwayLocation | null = null;

  for (const n in o) {
    if (n.match(propertyNameRegexp)) {
      name = n;
      location = o[n] as RoadwayLocation | null;
      return {
        name,
        location,
      }
    }
  }
  return {
    name,
    location,
  };
}
