/// <reference path="typings/index.d.ts" />
/// <reference path="Ferries.d.ts" />

import { parseWcfDate } from "./CommonUtils";

// To use the Fetch API in node, the node-fetch module is required.
// Older web browsers may require a polyfill.
let fetch = typeof window === "undefined" ? require("node-fetch") : window.fetch;
let dateFmt = new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
});

function formatDate(theDate: Date) {
    return dateFmt.format(theDate).replace(/\//g, "-");
}

export default class FerriesClient {
    private lastFlushDate: Date;
    private dateRange: DateRange;
    /**
     *
     */
    constructor(public apiAccessCode, public apiRoot: string = "http://www.wsdot.wa.gov/ferries/api/fares/rest/") {

    }
    getCacheFlushDate(): Promise<Date> {
        let url = `${this.apiRoot}cacheflushdate`;
        return fetch(url).then(function (response) {
            return response.text();
        }).then(function (dateString) {
            var d = new Date(dateString);
            return d;
        });
    }
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
    private getValueFromCacheOrRemote(propertyName: string, remoteFunction: Function): Promise<any> {
        let self = this;
        // if (!self.hasOwnProperty(propertyName)) { // The test doesn't detect the property.
        //     throw new Error(`Invalid property name: ${propertyName}`);
        // }
        if (!this[propertyName]) {
            return remoteFunction();
        } else {
            return self.hasCacheBeenUpdated().then(function (isUpdated) {
                if (!isUpdated && self[propertyName]) {
                    return self[propertyName];
                } else {
                    return remoteFunction();
                }
            });
        }
    }
    getValidDateRange(): Promise<DateRange> {
        let url = `${this.apiRoot}validdaterange?apiaccesscode=${this.apiAccessCode}`;
        let self = this;
        let getDateRangeFunc = function () {
            return fetch(url).then(function (response) {
                return response.text();
            }).then(function (txt) {
                self.dateRange = JSON.parse(txt, function (k, v) {
                    var date: Date | string;
                    if (/Date/i.test(k)) {
                        date = parseWcfDate(v);
                    }
                    return date || v;
                });
                return self.dateRange;
            });
        };

        return this.getValueFromCacheOrRemote("dateRange", getDateRangeFunc);
    };
    getTerminals(tripDate: Date): Promise<Terminal[]> {
        let url = `${this.apiRoot}terminals/${formatDate(tripDate)}?apiaccesscode=${this.apiAccessCode}`;
        let f = function (): Promise<Terminal[]> {
            return fetch(url).then(function (response) {
                return response.json();
            });
        }
        // TODO: enable caching for dates.
        return f(); //this.getValueFromCacheOrRemote
    };
    getTerminalMates(tripDate: Date, terminalId:number):Promise<Terminal[]> {
        let url = `${this.apiRoot}terminalmates/${tripDate}/${terminalId}?apiaccesscode=${this.apiAccessCode}`;
        // TODO: enable caching for dates.
        return fetch(url).then(function(response){
            return response.json();
        });
    };
    getTerminalCombo(tripDate:Date, departingTerminalId: number, arrivingTerminalId: number):Promise<TerminalCombo> {
        let url = `${this.apiRoot}terminalcombo/${tripDate}/${departingTerminalId}/${arrivingTerminalId}?apiaccesscode=${this.apiAccessCode}`;
        
        // TODO: enable caching
        return fetch(url).then(function(response) {
            return response.json();
        });
    }
}