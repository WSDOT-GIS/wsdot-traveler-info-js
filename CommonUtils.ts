/// <reference path="typings/index.d.ts" />

/// <amd-module name="CommonUtils" />

let isBrowser = typeof window === "undefined";

// To use the Fetch API in node, the node-fetch module is required.
// Older web browsers may require a polyfill.
let fetch = isBrowser ? require("node-fetch") : window.fetch;

/**
 * Provides common functions for other modules.
 * @module CommonUtils
 */
export let wcfDateRe: RegExp = /^\/Date\((\d+)([+\-]\d+)?\)\/$/i;

export function responseToJson(response: Response): Promise<any> {
    let reviver = function (k: string, v: any) {
        let match: RegExpMatchArray;
        if (v && typeof v === "string") {
            return parseWcfDate(v);
        }
        return v;
    }

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
 */
export function buildSearchString(searchParams?: any): string {
    if (!searchParams) {
        return null;
    } else {
        let searchStringParts: string[] = [];
        if (searchParams) {
            for (let key in searchParams) {
                if (searchParams.hasOwnProperty(key)) {
                    let val: any = searchParams[key];
                    if (val != null) {
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