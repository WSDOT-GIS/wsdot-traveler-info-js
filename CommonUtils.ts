let isBrowser = typeof window === "undefined";

// To use the Fetch API in node, the node-fetch module is required.
// Older web browsers may require a polyfill.
let fetch = isBrowser ? require("node-fetch") : window.fetch;

/**
 * Provides common functions for other modules.
 * @module CommonUtils
 */

/**
 * Matches the date format string used by WCF services.
 * @type {RegExp}
 */
export let wcfDateRe: RegExp = /^\/Date\((\d+)([+\-]\d+)?\)\/$/i;

/**
 * Converts a HTTP fetch Response to JSON.
 * @param {Response} response - HTTP fetch response
 * @returns {Promise<Object>} Promise with parsed JSON object.
 */
export function responseToJson(response: Response): Promise<any> {
    let reviver = function (k: string, v: any) {
        let match: RegExpMatchArray;
        if (v && typeof v === "string") {
            return parseWcfDate(v);
        }
        return v;
    };

    return response.text().then(function (text) {
        let re = /^\s*\w+\s*\((.+?)\);?\s*$/;
        let match = text.match(re);
        if (match) {
            try {
                return JSON.parse(match[1], reviver);
            } catch (err) {
                console.log(match, err);
                throw err;
            }
        } else {
            return JSON.parse(text, reviver);
        }
    });
}

/**
 * Submits a JSONP request via a temporarily added script tag.
 * @param {string} url - JSONP request URL
 * @returns {Promise<Object>} - parsed JSON response
 */
export function getJsonP(url: string): Promise<any> {
    return new Promise(function (resolve, reject) {
        let scriptTag = document.createElement("script");

        window.wsdot_ferries_callback = function (json: any) {
            document.head.removeChild(scriptTag);
            if (typeof json === "string") {
                json = parseWcfDate(json);
            } else if (typeof json === "object") {
                convertObjectProperties(json);
            }
            resolve(json);
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
export function getJsonFromUrl(url: string): Promise<any> {
    if (/&callback/.test(url)) {
        return getJsonP(url);
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
        let match = dateString.match(wcfDateRe);
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
export function buildSearchString(searchParams?: any): string | null {
    if (!searchParams) {
        return null;
    } else {
        let searchStringParts: string[] = [];
        if (searchParams) {
            for (let key in searchParams) {
                if (searchParams.hasOwnProperty(key)) {
                    let val: any = searchParams[key];
                    if (val != null) { // eslint-disable-line eqeqeq
                        if (val instanceof Date) {
                            val = val.toISOString();
                        }
                        searchStringParts.push(`${encodeURIComponent(key)}=${encodeURIComponent(val)}`);
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
export function convertObjectProperties(o: any): void {
    for (let key in o) {
        if (o.hasOwnProperty(key)) {
            let value = o[key];
            if (typeof value === "string" && value.length > 8) {
                o[key] = parseWcfDate(value);
            } else if (typeof value === "object") {
                convertObjectProperties(value);
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
export function hasAllProperties(o: Object, ...propertyNames: string[]): boolean {
    if (o === null) {
        return false;
    }
    let allFound = true;
    for (let n of propertyNames) {
        allFound = allFound && o.hasOwnProperty(n);
        if (!allFound) {
            break;
        }
    }
    return allFound;
}

/**
 * Gets the property name and value that matches the given Regexp.
 */
export function getPropertyMatching(o: any, propertyNameRegexp: RegExp): { name: string | null, location: any | null } {
    let name: string | null = null;
    let location: RoadwayLocation | null = null;

    for (let n in o) {
        if (n.match(propertyNameRegexp)) {
            name = n;
            location = o[n];
            break;
        }
    }
    return {
        name: name,
        location: location
    };
}