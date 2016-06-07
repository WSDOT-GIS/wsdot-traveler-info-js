/// <amd-module name="CommonUtils" />
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    /**
     * Provides common functions for other modules.
     * @module CommonUtils
     */
    exports.wcfDateRe = /^\/Date\((\d+)([+\-]\d+)?\)\/$/i;
    /**
     * Parses a WCF formatted string.
     * @param {string} dateString - A WCF formatted string.
     * @returns {(Date|string)} If the input is a valid WCF formatted date string,
     * a Date object will be returned. Otherwise the original string will be returned.
     */
    function parseWcfDate(dateString) {
        if (typeof dateString === "string") {
            var match = dateString.match(exports.wcfDateRe);
            if (match) {
                // Remove the whole match, the first item in array.
                // Parse remaining into numbers.
                var numParts = match.slice(1).map(Number);
                return new Date(numParts[0] + numParts[1]);
            }
        }
        return dateString;
    }
    exports.parseWcfDate = parseWcfDate;
    /**
     * Converts a date into a WCF formatted date string.
     * @param {Date} date - A date
     * @returns {string} WCF date string.
     */
    function toWcfDate(date) {
        return "/Date(" + date.getTime() + ")/";
    }
    exports.toWcfDate = toWcfDate;
    /**
     * Builds a search string.
     * @param {?Object} searchParams - Search parameters.
     */
    function buildSearchString(searchParams) {
        if (!searchParams) {
            return null;
        }
        else {
            var searchStringParts = [];
            if (searchParams) {
                for (var key in searchParams) {
                    if (searchParams.hasOwnProperty(key)) {
                        var val = searchParams[key];
                        if (val != null) {
                            if (val instanceof Date) {
                                val = val.toISOString();
                            }
                            searchStringParts.push(encodeURIComponent(key) + "=" + encodeURIComponent(val));
                        }
                    }
                }
            }
            return searchStringParts.join("&");
        }
    }
    exports.buildSearchString = buildSearchString;
    /**
     * Converts properties of an object. E.g., converts Wcf date strings into Date objects.
     */
    function convertObjectProperties(o) {
        for (var key in o) {
            if (o.hasOwnProperty(key)) {
                var value = o[key];
                if (typeof value === "string" && value.length > 8) {
                    o[key] = parseWcfDate(value);
                }
                else if (typeof value === "object") {
                    convertObjectProperties(value);
                }
            }
        }
    }
    exports.convertObjectProperties = convertObjectProperties;
});
