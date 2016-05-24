(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    /// <amd-module name="CommonUtils" />
    /**
     * Parses a WCF formatted string.
     * @param {string} dateString - A WCF formatted string.
     * @returns {(Date|string)} If the input is a valid WCF formatted date string,
     * a Date object will be returned. Otherwise the original string will be returned.
     */
    function parseWcfDate(dateString) {
        var wcfDateRe = /^\/Date\((\d+)([+\-]\d+)?\)\/$/i;
        if (typeof dateString === "string") {
            var match = dateString.match(wcfDateRe);
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
                        var element = searchParams[key];
                        if (element != null) {
                            searchStringParts.push(encodeURIComponent(key) + "=" + encodeURIComponent(element));
                        }
                    }
                }
            }
            return searchStringParts.join("&");
        }
    }
    exports.buildSearchString = buildSearchString;
});
