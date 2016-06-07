/// <reference path="typings/index.d.ts" />
/// <reference path="Ferries.d.ts" />
/// <reference path="index.d.ts" />
/**
 * Client for Ferries API.
 * @alias module:FerriesClient
 */
export default class FerriesClient {
    apiAccessCode: string;
    useCallback: boolean;
    apiRoot: string;
    private lastFlushDate;
    private dateRange;
    /**
     * Creates a new instance of the client class.
     * @param {string} apiAccessCode - Get an access code {@link http://www.wsdot.wa.gov/traffic/api/ here}.
     * @param {Boolean} useCallback - Set to true for browsers since API is not CORS-compatible.
     * @param {string} [apiRoot="http://www.wsdot.wa.gov/ferries/api/fares/rest/"] - Root of the API URL. You only need to set this if the URL changes before this library is updated.
     */
    constructor(apiAccessCode: string, useCallback?: boolean, apiRoot?: string);
    private callbackSuffix;
    /**
     * Gets the cache flush date.
     * @returns {Promise.<Date>} - The date the info was last updated.
     */
    getCacheFlushDate(): Promise<Date>;
    /**
     * Gets a boolean indicating if the cache needs to be updated.
     * @returns {Promise.<Boolean>}
     */
    hasCacheBeenUpdated(): Promise<Boolean>;
    /**
     * Gets a value from cache. If the cache is outdated, requests updated data and stores it in cache.
     * @param {string} propertyName - The name of a property of this class that holds cached data.
     * @param {function} remoteFunction - The function that should be called if the cached data needs
     * to be refreshed.
     * @returns {Promise}
     * @private
     */
    private getValueFromCacheOrRemote(propertyName, remoteFunction);
    /**
     * Gets a list of valid dates for use with the API queries.
     * @returns {Promise.<DateRange>} - The valid date range.
     */
    getValidDateRange(): Promise<DateRange>;
    /**
     * Gets an array of terminals for a specific date.
     * @param {Date} tripDate - The date of the trip.
     * @returns {Promise.<Terminal[]>} - An array of terminals.
     */
    getTerminals(tripDate: Date): Promise<Terminal[]>;
    /**
     * Gets list of terminals that are destinations from a given terminal.
     * @param {Date} tripDate - trip date
     * @param {number} terminalID - ID for a terminal.
     * @returns {Promise.<Terminal[]>} - List of terminals.
     */
    getTerminalMates(tripDate: Date, terminalId: number): Promise<Terminal[]>;
    /**
     * Get information about a pair of terminals on a given date.
     * @param {Date} tripDate - trip date
     * @param {number} departingTerminalId - ID of departing terminal
     * @param {number} arrivingTerminalId - ID of arriving terminal.
     * @return {Promise.<TerminalCombo>} - Terminal combo info.
     */
    getTerminalCombo(tripDate: Date, departingTerminalId: number, arrivingTerminalId: number): Promise<TerminalCombo>;
    /**
     * Gets verbose terminal combo information.
     * @param {number} departingTerminalId - ID of departing terminal
     * @param {number} arrivingTerminalId - ID of arriving terminal.
     * @return {Promise.<TerminalComboVerbose[]>} - Terminal combo info.
     */
    getTerminalComboVerbose(tripDate: Date, departingTerminalId: number, arrivingTerminalId: number): Promise<TerminalComboVerbose[]>;
    /**
     * Gets fare line items
     * @param {number} departingTerminalId - ID of departing terminal
     * @param {number} arrivingTerminalId - ID of arriving terminal.
     * @param {boolean} roundTrip - round trip?
     * @param {boolean} [basic=false] - Return only basic line items?
     * @return {Promise.<FareLineItem[]>} - fare line items.
     */
    getFareLineItems(tripDate: Date, departingTerminalId: number, arrivingTerminalId: number, roundTrip: boolean, basic?: boolean): Promise<FareLineItem[]>;
    /**
     * Gets verbose fare line items.
     * @param {Date} tripDate - trip date
     * @return {Promise.<VerboseFareLineItem>} - verbose fare line items.
     */
    getFareLineItemsVerbose(tripDate: Date): Promise<VerboseFareLineItem>;
    /**
     * Gets fare totals.
     * @param {Date} tripDate - Trip date
     * @param {number} departingTerminalId - departing terminal ID
     * @param {number} arrivingTerminalId - arriving terminal ID
     * @param {boolean} roundTrip - round trip?
     * @param {number} fareLineItemId - fare line item ID
     * @param {number} quantity - how many tickets?
     */
    getFareTotals(tripDate: Date, departingTerminalId: number, arrivingTerminalId: number, roundTrip: boolean, farelineItemId: number, quantity: number): Promise<FareTotal[]>;
}
