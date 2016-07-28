/**
 * Provides common functions for other modules.
 * @module CommonUtils
 */
/**
 * Matches the date format string used by WCF services.
 * @type {RegExp}
 */
export declare let wcfDateRe: RegExp;
/**
 * Converts a HTTP fetch Response to JSON.
 * @param {Response} response - HTTP fetch response
 * @returns {Promise<Object>} Promise with parsed JSON object.
 */
export declare function responseToJson(response: Response): Promise<any>;
/**
 * Submits a JSONP request via a temporarily added script tag.
 * @param {string} url - JSONP request URL
 * @returns {Promise<Object>} - parsed JSON response
 */
export declare function getJsonP(url: string): Promise<any>;
/**
 * Makes JSON request (detecting if JSONP is necessary based on URL)
 * and parses output to an object.
 * @param {string} url - request URL
 * @returns {Promise.<Object>} - Parsed JSON response object promise
 */
export declare function getJsonFromUrl(url: string): Promise<any>;
/**
 * Parses a WCF formatted string.
 * @param {string} dateString - A WCF formatted string.
 * @returns {(Date|string)} If the input is a valid WCF formatted date string,
 * a Date object will be returned. Otherwise the original string will be returned.
 */
export declare function parseWcfDate(dateString: string): Date | string;
/**
 * Converts a date into a WCF formatted date string.
 * @param {Date} date - A date
 * @returns {string} WCF date string.
 */
export declare function toWcfDate(date: Date): string;
/**
 * Builds a search string.
 * @param {?Object} searchParams - Search parameters.
 * @returns {string} search string for URL
 */
export declare function buildSearchString(searchParams?: any): string;
/**
 * Converts properties of an object. E.g., converts Wcf date strings into Date objects.
 * @param {Object} o - an object.
 */
export declare function convertObjectProperties(o: any): void;
