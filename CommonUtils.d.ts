/**
 * Provides common functions for other modules.
 * @module CommonUtils
 */
/**
 * Parses a WCF formatted string.
 * @param {string} dateString - A WCF formatted string.
 * @returns {(Date|string)} If the input is a valid WCF formatted date string,
 * a Date object will be returned. Otherwise the original string will be returned.
 */
export declare function parseWcfDate(dateString: string): Date | string;
export declare function toWcfDate(date: Date): string;
/**
 * Builds a search string.
 * @param {?Object} searchParams - Search parameters.
 */
export declare function buildSearchString(searchParams?: any): string;
