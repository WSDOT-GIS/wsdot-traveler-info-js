/**
 * Provides common functions for other modules.
 * @module CommonUtils
 */
export declare let wcfDateRe: RegExp;
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
 */
export declare function buildSearchString(searchParams?: any): string;
/**
 * Converts properties of an object. E.g., converts Wcf date strings into Date objects.
 */
export declare function convertObjectProperties(o: any): void;
