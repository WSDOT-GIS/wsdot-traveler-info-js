/// <reference path="typings/index.d.ts" />
/// <reference path="Ferries.d.ts" />
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
    // To use the Fetch API in node, the node-fetch module is required.
    // Older web browsers may require a polyfill.
    var fetch = typeof window === "undefined" ? require("node-fetch") : window.fetch;
    var dateFmt = new Intl.DateTimeFormat(undefined, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    });
    function formatDate(theDate) {
        return dateFmt.format(theDate).replace(/\//g, "-");
    }
    var FerriesClient = (function () {
        /**
         *
         */
        function FerriesClient(apiAccessCode, apiRoot) {
            if (apiRoot === void 0) { apiRoot = "http://www.wsdot.wa.gov/ferries/api/fares/rest/"; }
            this.apiAccessCode = apiAccessCode;
            this.apiRoot = apiRoot;
        }
        FerriesClient.prototype.getCacheFlushDate = function () {
            var url = this.apiRoot + "cacheflushdate";
            return fetch(url).then(function (response) {
                return response.text();
            }).then(function (dateString) {
                var d = new Date(dateString);
                return d;
            });
        };
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
        FerriesClient.prototype.getValueFromCacheOrRemote = function (propertyName, remoteFunction) {
            var self = this;
            // if (!self.hasOwnProperty(propertyName)) { // The test doesn't detect the property.
            //     throw new Error(`Invalid property name: ${propertyName}`);
            // }
            if (!this[propertyName]) {
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
        FerriesClient.prototype.getValidDateRange = function () {
            var url = this.apiRoot + "validdaterange?apiaccesscode=" + this.apiAccessCode;
            var self = this;
            var getDateRangeFunc = function () {
                return fetch(url).then(function (response) {
                    return response.text();
                }).then(function (txt) {
                    self.dateRange = JSON.parse(txt, function (k, v) {
                        var date;
                        if (/Date/i.test(k)) {
                            date = CommonUtils_1.parseWcfDate(v);
                        }
                        return date || v;
                    });
                    return self.dateRange;
                });
            };
            return this.getValueFromCacheOrRemote("dateRange", getDateRangeFunc);
        };
        ;
        FerriesClient.prototype.getTerminals = function (tripDate) {
            var url = this.apiRoot + "terminals/" + formatDate(tripDate) + "?apiaccesscode=" + this.apiAccessCode;
            var f = function () {
                return fetch(url).then(function (response) {
                    return response.json();
                });
            };
            // TODO: enable caching for dates.
            return f(); //this.getValueFromCacheOrRemote
        };
        ;
        FerriesClient.prototype.getTerminalMates = function (tripDate, terminalId) {
            var url = this.apiRoot + "terminalmates/" + formatDate(tripDate) + "/" + terminalId + "?apiaccesscode=" + this.apiAccessCode;
            // TODO: enable caching for dates.
            return fetch(url).then(function (response) {
                return response.json();
            });
        };
        ;
        FerriesClient.prototype.getTerminalCombo = function (tripDate, departingTerminalId, arrivingTerminalId) {
            var url = this.apiRoot + "terminalcombo/" + formatDate(tripDate) + "/" + departingTerminalId + "/" + arrivingTerminalId + "?apiaccesscode=" + this.apiAccessCode;
            // TODO: enable caching
            return fetch(url).then(function (response) {
                return response.json();
            });
        };
        FerriesClient.prototype.getTerminalComboVerbose = function (tripDate, departingTerminalId, arrivingTerminalId) {
            var url = this.apiRoot + "terminalcomboverbose/" + formatDate(tripDate) + "?apiaccesscode=" + this.apiAccessCode;
            // TODO: enable caching
            return fetch(url).then(function (response) {
                return response.json();
            });
        };
        FerriesClient.prototype.getFareLineItems = function (tripDate, departingTerminalId, arrivingTerminalId, roundTrip, basic) {
            if (basic === void 0) { basic = false; }
            var url = this.apiRoot + "farelineitems" + (basic ? "basic" : "") + "/" + formatDate(tripDate) + "/" + departingTerminalId + "/" + arrivingTerminalId + "/" + roundTrip + "?apiaccesscode=" + this.apiAccessCode;
            // TODO: enable caching
            return fetch(url).then(function (response) {
                return response.json();
            });
        };
        FerriesClient.prototype.getFareLineItemsVerbose = function (tripDate) {
            var url = this.apiRoot + "farelineitemsverbose/" + formatDate(tripDate) + "?apiaccesscode=" + this.apiAccessCode;
            // TODO: enable caching
            return fetch(url).then(function (response) {
                return response.json();
            });
        };
        FerriesClient.prototype.getFareTotals = function (tripDate, departingTerminalId, arrivingTerminalId, roundTrip, farelineItemId, quantity) {
            var url = this.apiRoot + "faretotals/" + formatDate(tripDate) + "/" + departingTerminalId + "/" + arrivingTerminalId + "/" + roundTrip + "/" + farelineItemId + "/" + quantity + "?apiaccesscode=" + this.apiAccessCode;
            // TODO: enable caching.
            return fetch(url).then(function (response) { return response.json(); });
        };
        return FerriesClient;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = FerriesClient;
});
