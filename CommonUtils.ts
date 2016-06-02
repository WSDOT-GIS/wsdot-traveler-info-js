/// <amd-module name="CommonUtils" />

/**
 * Provides common functions for other modules.
 * @module CommonUtils
 */

/**
 * Parses a WCF formatted string.
 * @param {string} dateString - A WCF formatted string.
 * @returns {(Date|string)} If the input is a valid WCF formatted date string, 
 * a Date object will be returned. Otherwise the original string will be returned.
 */
export function parseWcfDate(dateString: string): Date | string {
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
                    let val:any = searchParams[key];
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