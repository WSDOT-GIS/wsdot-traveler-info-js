/// <reference path="typings/index.d.ts" />
/// <reference path="Ferries.d.ts" />
/// <reference path="index.d.ts" />


/**
 * Client for {@link http://www.wsdot.wa.gov/ferries/api/fares/documentation/ WSDOT Ferries API}.
 * @module FerriesClient
 */


import { parseWcfDate, wcfDateRe, convertObjectProperties } from "./CommonUtils";


let isBrowser = typeof window === "undefined";

// To use the Fetch API in node, the node-fetch module is required.
// Older web browsers may require a polyfill.
let fetch = isBrowser ? require("node-fetch") : window.fetch;
let dateFmt = new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
});

/**
 * Formats the date to YYYY-MM-DD format.
 * @param {Date} theDate - Date to be formatted.
 * @returns {string}
 */
function formatDate(theDate: Date): string {
    return dateFmt.format(theDate).replace(/\//g, "-");
}


function responseToJson(response: Response): Promise<any> {
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

function getJsonP(url: string): Promise<any> {
    return new Promise(function (resolve, reject) {
        let scriptTag = document.createElement("script");

        window.wsdot_ferries_callback = function (json: any) {
            document.head.removeChild(scriptTag);
            convertObjectProperties(json);
            resolve(json);
        };

        scriptTag.src = url;

        document.head.appendChild(scriptTag);

    });
}

function getJsonFromUrl(url: string): Promise<any> {
    if (/&callback/.test(url)) {
        return getJsonP(url);
    } else {
        return fetch(url).then(responseToJson);
    }
}


/**
 * Client for Ferries API.
 * @alias module:FerriesClient
 */
export default class FerriesClient {
    private lastFlushDate: Date;
    private dateRange: DateRange;
    /**
     * Creates a new instance of the client class.
     * @param {string} apiAccessCode - Get an access code {@link http://www.wsdot.wa.gov/traffic/api/ here}.
     * @param {Boolean} useCallback - Set to true for browsers since API is not CORS-compatible.
     * @param {string} [apiRoot="http://www.wsdot.wa.gov/ferries/api/fares/rest/"] - Root of the API URL. You only need to set this if the URL changes before this library is updated. 
     */
    constructor(public apiAccessCode: string, public useCallback: boolean = false, public apiRoot: string = "http://www.wsdot.wa.gov/ferries/api/fares/rest/") { }
    private callbackSuffix: string = this.useCallback ? "&callback=wsdot_ferries_callback" : "";

    /**
     * Gets the cache flush date.
     * @returns {Promise.<Date>} - The date the info was last updated.
     */
    getCacheFlushDate(): Promise<Date> {
        let url = `${this.apiRoot}cacheflushdate`;
        if (this.useCallback) {
            url = `${url}${this.callbackSuffix.replace(/^&/, '?')}`;
        }
        if (!this.useCallback) {
            return fetch(url).then(function (response: Response) {
                return response.text();
            }).then(function (dateString: string) {
                var d = new Date(dateString);
                return d;
            });
        } else {
            return getJsonP(url).then(parseWcfDate);
        }
    }
    /**
     * Gets a boolean indicating if the cache needs to be updated.
     * @returns {Promise.<Boolean>}
     */
    hasCacheBeenUpdated(): Promise<Boolean> {
        let self = this;
        return this.getCacheFlushDate().then(function (d) {
            var output = d !== self.lastFlushDate;
            if (output) {
                self.lastFlushDate = d;
            }
            return output;
        });

    }
    /**
     * Gets a value from cache. If the cache is outdated, requests updated data and stores it in cache.
     * @param {string} propertyName - The name of a property of this class that holds cached data.
     * @param {function} remoteFunction - The function that should be called if the cached data needs 
     * to be refreshed.
     * @returns {Promise}
     * @private
     */
    private getValueFromCacheOrRemote(propertyName: string, remoteFunction: Function): Promise<any> {
        let self: any = this;
        if (!self[propertyName]) {
            return remoteFunction();
        } else {
            return self.hasCacheBeenUpdated().then(function (isUpdated: boolean) {
                if (!isUpdated && self[propertyName]) {
                    return self[propertyName];
                } else {
                    return remoteFunction();
                }
            });
        }
    }
    /**
     * Gets a list of valid dates for use with the API queries.
     * @returns {Promise.<DateRange>} - The valid date range. 
     */
    getValidDateRange(): Promise<DateRange> {
        let url = `${this.apiRoot}validdaterange?apiaccesscode=${this.apiAccessCode}${this.callbackSuffix}`;
        let self = this;
        return this.getValueFromCacheOrRemote("dateRange", function () {
            return getJsonFromUrl(url);
        });
    };
    /**
     * Gets an array of terminals for a specific date.
     * @param {Date} tripDate - The date of the trip.
     * @returns {Promise.<Terminal[]>} - An array of terminals.
     */
    getTerminals(tripDate: Date): Promise<Terminal[]> {
        let url = `${this.apiRoot}terminals/${formatDate(tripDate)}?apiaccesscode=${this.apiAccessCode}${this.callbackSuffix}`;
        let self = this;
        // TODO: enable caching for dates.
        return getJsonFromUrl(url);
    };
    /**
     * Gets list of terminals that are destinations from a given terminal.
     * @param {Date} tripDate - trip date
     * @param {number} terminalID - ID for a terminal.
     * @returns {Promise.<Terminal[]>} - List of terminals.
     */
    getTerminalMates(tripDate: Date, terminalId: number): Promise<Terminal[]> {
        let url = `${this.apiRoot}terminalmates/${formatDate(tripDate)}/${terminalId}?apiaccesscode=${this.apiAccessCode}${this.callbackSuffix}`;
        // TODO: enable caching for dates.
        return getJsonFromUrl(url);
    };
    /**
     * Get information about a pair of terminals on a given date.
     * @param {Date} tripDate - trip date
     * @param {number} departingTerminalId - ID of departing terminal
     * @param {number} arrivingTerminalId - ID of arriving terminal.
     * @return {Promise.<TerminalCombo>} - Terminal combo info.
     */
    getTerminalCombo(
        tripDate: Date,
        departingTerminalId: number,
        arrivingTerminalId: number
    ): Promise<TerminalCombo> {
        let url = `${this.apiRoot}terminalcombo/${formatDate(tripDate)}/${departingTerminalId}/${arrivingTerminalId}?apiaccesscode=${this.apiAccessCode}${this.callbackSuffix}`;

        // TODO: enable caching
        return getJsonFromUrl(url);
    }
    /**
     * Gets verbose terminal combo information.
     * @param {number} departingTerminalId - ID of departing terminal
     * @param {number} arrivingTerminalId - ID of arriving terminal.
     * @return {Promise.<TerminalComboVerbose[]>} - Terminal combo info.
     */
    getTerminalComboVerbose(
        tripDate: Date,
        departingTerminalId: number,
        arrivingTerminalId: number
    ): Promise<TerminalComboVerbose[]> {
        let url = `${this.apiRoot}terminalcomboverbose/${formatDate(tripDate)}?apiaccesscode=${this.apiAccessCode}${this.callbackSuffix}`;

        // TODO: enable caching
        return getJsonFromUrl(url);
    }

    /**
     * Gets fare line items
     * @param {number} departingTerminalId - ID of departing terminal
     * @param {number} arrivingTerminalId - ID of arriving terminal.
     * @param {boolean} roundTrip - round trip?
     * @param {boolean} [basic=false] - Return only basic line items?
     * @return {Promise.<FareLineItem[]>} - fare line items.
     */
    getFareLineItems(
        tripDate: Date,
        departingTerminalId: number,
        arrivingTerminalId: number,
        roundTrip: boolean, basic: boolean = false
    ): Promise<FareLineItem[]> {
        let url = `${this.apiRoot}farelineitems${basic ? "basic" : ""}/${formatDate(tripDate)}/${departingTerminalId}/${arrivingTerminalId}/${roundTrip}?apiaccesscode=${this.apiAccessCode}${this.callbackSuffix}`;

        // TODO: enable caching
        return getJsonFromUrl(url);
    }

    /**
     * Gets verbose fare line items.
     * @param {Date} tripDate - trip date
     * @return {Promise.<VerboseFareLineItem>} - verbose fare line items.
     */
    getFareLineItemsVerbose(tripDate: Date): Promise<VerboseFareLineItem> {
        let url = `${this.apiRoot}farelineitemsverbose/${formatDate(tripDate)}?apiaccesscode=${this.apiAccessCode}${this.callbackSuffix}`;

        // TODO: enable caching
        return getJsonFromUrl(url);
    }

    /**
     * Gets fare totals.
     * @param {Date} tripDate - Trip date
     * @param {number} departingTerminalId - departing terminal ID
     * @param {number} arrivingTerminalId - arriving terminal ID
     * @param {boolean} roundTrip - round trip?
     * @param {number} fareLineItemId - fare line item ID
     * @param {number} quantity - how many tickets? 
     */
    getFareTotals(
        tripDate: Date,
        departingTerminalId: number,
        arrivingTerminalId: number,
        roundTrip: boolean,
        farelineItemId: number,
        quantity: number
    ): Promise<FareTotal[]> {
        let url = `${this.apiRoot}faretotals/${formatDate(tripDate)}/${departingTerminalId}/${arrivingTerminalId}/${roundTrip}/${farelineItemId}/${quantity}?apiaccesscode=${this.apiAccessCode}${this.callbackSuffix}`;

        // TODO: enable caching.
        return getJsonFromUrl(url);
    }
}