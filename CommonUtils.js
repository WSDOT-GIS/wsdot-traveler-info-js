/// <reference path="typings/index.d.ts" />
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    var isBrowser = typeof window === "undefined";
    // To use the Fetch API in node, the node-fetch module is required.
    // Older web browsers may require a polyfill.
    var fetch = isBrowser ? require("node-fetch") : window.fetch;
    /**
     * Provides common functions for other modules.
     * @module CommonUtils
     */
    /**
     * Matches the date format string used by WCF services.
     * @type {RegExp}
     */
    exports.wcfDateRe = /^\/Date\((\d+)([+\-]\d+)?\)\/$/i;
    /**
     * Converts a HTTP fetch Response to JSON.
     * @param {Response} response - HTTP fetch response
     * @returns {Promise<Object>}
     */
    function responseToJson(response) {
        var reviver = function (k, v) {
            var match;
            if (v && typeof v === "string") {
                return parseWcfDate(v);
            }
            return v;
        };
        return response.text().then(function (text) {
            var re = /^\s*\w+\s*\((.+?)\);?\s*$/;
            var match = text.match(re);
            if (match) {
                try {
                    return JSON.parse(match[1], reviver);
                }
                catch (err) {
                    console.log(match, err);
                    throw err;
                }
            }
            else {
                return JSON.parse(text, reviver);
            }
        });
    }
    exports.responseToJson = responseToJson;
    /**
     * Submits a JSONP request via a temporarily added script tag.
     * @param {string} url - JSONP request URL
     * @returns {Promise<Object>} - parsed JSON response
     */
    function getJsonP(url) {
        return new Promise(function (resolve, reject) {
            var scriptTag = document.createElement("script");
            window.wsdot_ferries_callback = function (json) {
                document.head.removeChild(scriptTag);
                if (typeof json === "string") {
                    json = parseWcfDate(json);
                }
                else if (typeof json === "object") {
                    convertObjectProperties(json);
                }
                resolve(json);
            };
            scriptTag.src = url;
            document.head.appendChild(scriptTag);
        });
    }
    exports.getJsonP = getJsonP;
    /**
     * Makes JSON request (detecting if JSONP is necessary based on URL)
     * and parses output to an object.
     * @param {string} url - request URL
     * @returns {Promise.<Object>}
     */
    function getJsonFromUrl(url) {
        if (/&callback/.test(url)) {
            return getJsonP(url);
        }
        else {
            return fetch(url).then(responseToJson);
        }
    }
    exports.getJsonFromUrl = getJsonFromUrl;
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
     * @param {Object} o - an object.
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
