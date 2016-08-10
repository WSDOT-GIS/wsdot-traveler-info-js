/**
 * Client for {@link http://www.wsdot.wa.gov/ferries/api/fares/documentation/ WSDOT Ferries API}.
 * @module FerriesClient
 */
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "./CommonUtils"], factory);
    }
})(function (require, exports) {
    "use strict";
    var CommonUtils_1 = require("./CommonUtils");
    // let isBrowser = typeof window === "undefined";
    // // To use the Fetch API in node, the node-fetch module is required.
    // // Older web browsers may require a polyfill.
    // let fetch = isBrowser ? require("node-fetch") : window.fetch;
    var dateFmt = new Intl.DateTimeFormat(undefined, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    });
    /**
     * Formats the date to YYYY-MM-DD format.
     * @param {Date} theDate - Date to be formatted.
     * @returns {string}
     */
    function formatDate(theDate) {
        return dateFmt.format(theDate).replace(/\//g, "-");
    }
    /**
     * Client for Ferries API.
     * @alias module:FerriesClient
     */
    var FerriesClient = (function () {
        /**
         * Creates a new instance of the client class.
         * @param {string} apiAccessCode - Get an access code {@link http://www.wsdot.wa.gov/traffic/api/ here}.
         * @param {Boolean} useCallback - Set to true for browsers since API is not CORS-compatible.
         * @param {string} [apiRoot="http://www.wsdot.wa.gov/ferries/api/fares/rest/"] - Root of the API URL. You only need to set this if the URL changes before this library is updated.
         * @param {string} [proxy] - Proxy URL for the date
         */
        function FerriesClient(apiAccessCode, useCallback, apiRoot, proxy) {
            if (useCallback === void 0) { useCallback = false; }
            if (apiRoot === void 0) { apiRoot = "http://www.wsdot.wa.gov/ferries/api/fares/rest/"; }
            this.apiAccessCode = apiAccessCode;
            this.useCallback = useCallback;
            this.apiRoot = apiRoot;
            this.proxy = proxy;
            this.callbackSuffix = this.useCallback ? "&callback=wsdot_ferries_callback" : "";
        }
        /**
         * Gets the cache flush date.
         * @returns {Promise.<Date>} - The date the info was last updated.
         */
        FerriesClient.prototype.getCacheFlushDate = function () {
            var url = this.apiRoot + "cacheflushdate";
            if (this.useCallback) {
                // This API call doesn't support JSONP.  Use proxy if provided.
                if (this.proxy) {
                    url = "" + this.proxy + url;
                }
            }
            return CommonUtils_1.getJsonFromUrl(url);
        };
        /**
         * Gets a boolean indicating if the cache needs to be updated.
         * @returns {Promise.<Boolean>}
         */
        FerriesClient.prototype.hasCacheBeenUpdated = function () {
            var self = this;
            return this.getCacheFlushDate().then(function (d) {
                var output = d !== self.lastFlushDate;
                if (output) {
                    self.lastFlushDate = d;
                }
                return output;
            });
        };
        /**
         * Gets a value from cache. If the cache is outdated, requests updated data and stores it in cache.
         * @param {string} propertyName - The name of a property of this class that holds cached data.
         * @param {function} remoteFunction - The function that should be called if the cached data needs
         * to be refreshed.
         * @returns {Promise}
         * @private
         */
        FerriesClient.prototype.getValueFromCacheOrRemote = function (propertyName, remoteFunction) {
            var self = this;
            if (!self[propertyName]) {
                return remoteFunction();
            }
            else {
                return self.hasCacheBeenUpdated().then(function (isUpdated) {
                    if (!isUpdated && self[propertyName]) {
                        return self[propertyName];
                    }
                    else {
                        return remoteFunction();
                    }
                });
            }
        };
        /**
         * Gets a list of valid dates for use with the API queries.
         * @returns {Promise.<DateRange>} - The valid date range.
         */
        FerriesClient.prototype.getValidDateRange = function () {
            var url = this.apiRoot + "validdaterange?apiaccesscode=" + this.apiAccessCode + this.callbackSuffix;
            var self = this;
            return this.getValueFromCacheOrRemote("dateRange", function () {
                return CommonUtils_1.getJsonFromUrl(url);
            });
        };
        ;
        /**
         * Gets an array of terminals for a specific date.
         * @param {Date} tripDate - The date of the trip.
         * @returns {Promise.<Terminal[]>} - An array of terminals.
         */
        FerriesClient.prototype.getTerminals = function (tripDate) {
            var url = this.apiRoot + "terminals/" + formatDate(tripDate) + "?apiaccesscode=" + this.apiAccessCode + this.callbackSuffix;
            var self = this;
            // TODO: enable caching for dates.
            return CommonUtils_1.getJsonFromUrl(url);
        };
        ;
        /**
         * Gets list of terminals that are destinations from a given terminal.
         * @param {Date} tripDate - trip date
         * @param {number} terminalID - ID for a terminal.
         * @returns {Promise.<Terminal[]>} - List of terminals.
         */
        FerriesClient.prototype.getTerminalMates = function (tripDate, terminalId) {
            var url = this.apiRoot + "terminalmates/" + formatDate(tripDate) + "/" + terminalId + "?apiaccesscode=" + this.apiAccessCode + this.callbackSuffix;
            // TODO: enable caching for dates.
            return CommonUtils_1.getJsonFromUrl(url);
        };
        ;
        /**
         * Get information about a pair of terminals on a given date.
         * @param {Date} tripDate - trip date
         * @param {number} departingTerminalId - ID of departing terminal
         * @param {number} arrivingTerminalId - ID of arriving terminal.
         * @return {Promise.<TerminalCombo>} - Terminal combo info.
         */
        FerriesClient.prototype.getTerminalCombo = function (tripDate, departingTerminalId, arrivingTerminalId) {
            var url = this.apiRoot + "terminalcombo/" + formatDate(tripDate) + "/" + departingTerminalId + "/" + arrivingTerminalId + "?apiaccesscode=" + this.apiAccessCode + this.callbackSuffix;
            // TODO: enable caching
            return CommonUtils_1.getJsonFromUrl(url);
        };
        /**
         * Gets verbose terminal combo information.
         * @param {number} departingTerminalId - ID of departing terminal
         * @param {number} arrivingTerminalId - ID of arriving terminal.
         * @return {Promise.<TerminalComboVerbose[]>} - Terminal combo info.
         */
        FerriesClient.prototype.getTerminalComboVerbose = function (tripDate, departingTerminalId, arrivingTerminalId) {
            var url = this.apiRoot + "terminalcomboverbose/" + formatDate(tripDate) + "?apiaccesscode=" + this.apiAccessCode + this.callbackSuffix;
            // TODO: enable caching
            return CommonUtils_1.getJsonFromUrl(url);
        };
        /**
         * Gets fare line items
         * @param {number} departingTerminalId - ID of departing terminal
         * @param {number} arrivingTerminalId - ID of arriving terminal.
         * @param {boolean} roundTrip - round trip?
         * @param {boolean} [basic=false] - Return only basic line items?
         * @return {Promise.<FareLineItem[]>} - fare line items.
         */
        FerriesClient.prototype.getFareLineItems = function (tripDate, departingTerminalId, arrivingTerminalId, roundTrip, basic) {
            if (basic === void 0) { basic = false; }
            var url = this.apiRoot + "farelineitems" + (basic ? "basic" : "") + "/" + formatDate(tripDate) + "/" + departingTerminalId + "/" + arrivingTerminalId + "/" + roundTrip + "?apiaccesscode=" + this.apiAccessCode + this.callbackSuffix;
            // TODO: enable caching
            return CommonUtils_1.getJsonFromUrl(url);
        };
        /**
         * Gets verbose fare line items.
         * @param {Date} tripDate - trip date
         * @return {Promise.<VerboseFareLineItem>} - verbose fare line items.
         */
        FerriesClient.prototype.getFareLineItemsVerbose = function (tripDate) {
            var url = this.apiRoot + "farelineitemsverbose/" + formatDate(tripDate) + "?apiaccesscode=" + this.apiAccessCode + this.callbackSuffix;
            // TODO: enable caching
            return CommonUtils_1.getJsonFromUrl(url);
        };
        /**
         * Gets fare totals.
         * @param {Date} tripDate - Trip date
         * @param {number} departingTerminalId - departing terminal ID
         * @param {number} arrivingTerminalId - arriving terminal ID
         * @param {boolean} roundTrip - round trip?
         * @param {number} fareLineItemId - fare line item ID
         * @param {number} quantity - how many tickets?
         */
        FerriesClient.prototype.getFareTotals = function (tripDate, departingTerminalId, arrivingTerminalId, roundTrip, farelineItemId, quantity) {
            var url = this.apiRoot + "faretotals/" + formatDate(tripDate) + "/" + departingTerminalId + "/" + arrivingTerminalId + "/" + roundTrip + "/" + farelineItemId + "/" + quantity + "?apiaccesscode=" + this.apiAccessCode + this.callbackSuffix;
            // TODO: enable caching.
            return CommonUtils_1.getJsonFromUrl(url);
        };
        return FerriesClient;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = FerriesClient;
});
