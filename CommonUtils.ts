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
 * Builds a search string.
 * @param {?Object} searchParams - Search parameters.
 */
export function buildSearchString(searchParams?: Object): string {
    if (!searchParams) {
        return null;
    } else {
        let searchStringParts: string[] = [];
        if (searchParams) {
            for (var key in searchParams) {
                if (searchParams.hasOwnProperty(key)) {
                    var element = searchParams[key];
                    if (element != null) {
                        searchStringParts.push(`${encodeURIComponent(key)}=${encodeURIComponent(element)}`);
                    }
                }
            }
        }
        return searchStringParts.join("&");
    }
}