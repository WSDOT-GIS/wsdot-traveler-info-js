/**
 * Client for {@link http://www.wsdot.wa.gov/ferries/api/fares/documentation/ WSDOT Ferries API}.
 * @module FerriesClient
 */

import { getJsonFromUrl } from "./CommonUtils";
import {
  DateRange,
  FareLineItem,
  FareTotal,
  Terminal,
  TerminalCombo,
  TerminalComboVerbose,
  VerboseFareLineItem
} from "./Ferries";

/**
 * Formats the date to YYYY-MM-DD format.
 * @param {Date} theDate - Date to be formatted.
 * @returns {string}
 */
function formatDate(theDate: Date): string {
  const dateParts = [
    theDate.getFullYear(),
    theDate.getMonth() + 1,
    theDate.getDate()
  ].map(function(n, index) {
    if (index === 0) {
      return n.toString(10);
    } else {
      let s = n.toString(10);
      if (s.length === 1) {
        s = `0${s}`;
      }
      return s;
    }
  });
  return dateParts.join("-");
}

/**
 * Client for Ferries API.
 * @alias module:FerriesClient
 */
export default class FerriesClient {
  private lastFlushDate: Date | null = null;
  private callbackSuffix: string = this.useCallback
    ? "&callback=wsdot_ferries_callback"
    : "";
  /**
   * Creates a new instance of the client class.
   * @param {string} apiAccessCode - Get an access code {@link http://www.wsdot.wa.gov/traffic/api/ here}.
   * @param {Boolean} useCallback - Set to true for browsers since API is not CORS-compatible.
   * @param {string} [apiRoot="http://www.wsdot.wa.gov/ferries/api/fares/rest/"] - Root of the API URL. You only need to set this if the URL changes before this library is updated.
   * @param {string} [proxy] - Proxy URL for the date
   */
  constructor(
    public apiAccessCode: string,
    public useCallback: boolean = false,
    public apiRoot: string = "http://www.wsdot.wa.gov/ferries/api/fares/rest/",
    public proxy?: string
  ) {}

  /**
   * Gets the cache flush date.
   * @returns {Promise.<Date>} - The date the info was last updated.
   */
  public getCacheFlushDate(): Promise<Date> {
    let url = `${this.apiRoot}cacheflushdate`;
    if (this.useCallback) {
      // This API call doesn't support JSONP.  Use proxy if provided.
      if (this.proxy) {
        url = `${this.proxy}${url}`;
      }
      // url = `${url}${this.callbackSuffix.replace(/^&/, "?")}`;
    }
    return getJsonFromUrl(url);
  }
  /**
   * Gets a boolean indicating if the cache needs to be updated.
   * @returns {Promise.<Boolean>}
   */
  public async hasCacheBeenUpdated() {
    const self = this;
    const d = await this.getCacheFlushDate();
    const output = d !== self.lastFlushDate;
    if (output) {
      self.lastFlushDate = d;
    }
    return output;
  }

  /**
   * Gets a list of valid dates for use with the API queries.
   * @returns {Promise.<DateRange>} - The valid date range.
   */
  public getValidDateRange(): Promise<DateRange> {
    const url = `${this.apiRoot}validdaterange?apiaccesscode=${
      this.apiAccessCode
    }${this.callbackSuffix}`;
    return this.getValueFromCacheOrRemote("dateRange", function() {
      return getJsonFromUrl(url);
    });
  }
  /**
   * Gets an array of terminals for a specific date.
   * @param {Date} tripDate - The date of the trip.
   * @returns {Promise.<Terminal[]>} - An array of terminals.
   */
  public getTerminals(tripDate: Date): Promise<Terminal[]> {
    const url = `${this.apiRoot}terminals/${formatDate(
      tripDate
    )}?apiaccesscode=${this.apiAccessCode}${this.callbackSuffix}`;
    // TODO: enable caching for dates.
    return getJsonFromUrl(url);
  }
  /**
   * Gets list of terminals that are destinations from a given terminal.
   * @param {Date} tripDate - trip date
   * @param {number} terminalID - ID for a terminal.
   * @returns {Promise.<Terminal[]>} - List of terminals.
   */
  public getTerminalMates(
    tripDate: Date,
    terminalId: number
  ): Promise<Terminal[]> {
    const url = `${this.apiRoot}terminalmates/${formatDate(
      tripDate
    )}/${terminalId}?apiaccesscode=${this.apiAccessCode}${this.callbackSuffix}`;
    // TODO: enable caching for dates.
    return getJsonFromUrl(url);
  }
  /**
   * Get information about a pair of terminals on a given date.
   * @param {Date} tripDate - trip date
   * @param {number} departingTerminalId - ID of departing terminal
   * @param {number} arrivingTerminalId - ID of arriving terminal.
   * @return {Promise.<TerminalCombo>} - Terminal combo info.
   */
  public getTerminalCombo(
    tripDate: Date,
    departingTerminalId: number,
    arrivingTerminalId: number
  ): Promise<TerminalCombo> {
    const url = `${this.apiRoot}terminalcombo/${formatDate(
      tripDate
    )}/${departingTerminalId}/${arrivingTerminalId}?apiaccesscode=${
      this.apiAccessCode
    }${this.callbackSuffix}`;

    // TODO: enable caching
    return getJsonFromUrl(url);
  }
  /**
   * Gets verbose terminal combo information.
   * @param {number} departingTerminalId - ID of departing terminal
   * @param {number} arrivingTerminalId - ID of arriving terminal.
   * @return {Promise.<TerminalComboVerbose[]>} - Terminal combo info.
   */
  public getTerminalComboVerbose(
    tripDate: Date,
    departingTerminalId: number,
    arrivingTerminalId: number
  ): Promise<TerminalComboVerbose[]> {
    const url = `${this.apiRoot}terminalcomboverbose/${formatDate(
      tripDate
    )}?apiaccesscode=${this.apiAccessCode}${this.callbackSuffix}`;

    // TODO: enable caching
    return getJsonFromUrl(url);
  }

  /**
   * Gets fare line items
   * @param {number} departingTerminalId - ID of departing terminal
   * @param {number} arrivingTerminalId - ID of arriving terminal.
   * @param {boolean} roundTrip - round trip?
   * @param {boolean} [basic=false] - Return only basic line items?
   * @return {Promise.<FareLineItem[]>} - fare line items.
   */
  public getFareLineItems(
    tripDate: Date,
    departingTerminalId: number,
    arrivingTerminalId: number,
    roundTrip: boolean,
    basic: boolean = false
  ): Promise<FareLineItem[]> {
    const url = `${this.apiRoot}farelineitems${
      basic ? "basic" : ""
    }/${formatDate(
      tripDate
    )}/${departingTerminalId}/${arrivingTerminalId}/${roundTrip}?apiaccesscode=${
      this.apiAccessCode
    }${this.callbackSuffix}`;

    // TODO: enable caching
    return getJsonFromUrl(url);
  }

  /**
   * Gets verbose fare line items.
   * @param {Date} tripDate - trip date
   * @return {Promise.<VerboseFareLineItem>} - verbose fare line items.
   */
  public getFareLineItemsVerbose(tripDate: Date): Promise<VerboseFareLineItem> {
    const url = `${this.apiRoot}farelineitemsverbose/${formatDate(
      tripDate
    )}?apiaccesscode=${this.apiAccessCode}${this.callbackSuffix}`;

    // TODO: enable caching
    return getJsonFromUrl(url);
  }

  /**
   * Gets fare totals.
   * @param {Date} tripDate - Trip date
   * @param {number} departingTerminalId - departing terminal ID
   * @param {number} arrivingTerminalId - arriving terminal ID
   * @param {boolean} roundTrip - round trip?
   * @param {number} fareLineItemId - fare line item ID
   * @param {number} quantity - how many tickets?
   */
  public getFareTotals(
    tripDate: Date,
    departingTerminalId: number,
    arrivingTerminalId: number,
    roundTrip: boolean,
    farelineItemId: number,
    quantity: number
  ): Promise<FareTotal[]> {
    const url = `${this.apiRoot}faretotals/${formatDate(
      tripDate
    )}/${departingTerminalId}/${arrivingTerminalId}/${roundTrip}/${farelineItemId}/${quantity}?apiaccesscode=${
      this.apiAccessCode
    }${this.callbackSuffix}`;

    // TODO: enable caching.
    return getJsonFromUrl(url);
  }

  /**
   * Gets a value from cache. If the cache is outdated, requests updated data and stores it in cache.
   * @param {string} propertyName - The name of a property of this class that holds cached data.
   * @param {function} remoteFunction - The function that should be called if the cached data needs
   * to be refreshed.
   * @returns {Promise}
   * @private
   */
  private async getValueFromCacheOrRemote(
    propertyName: string,
    remoteFunction: (...params: any[]) => any
  ) {
    const self: any = this;
    if (!self[propertyName]) {
      return remoteFunction();
    } else {
      if ((await self.hasCacheBeenUpdated()) && self[propertyName]) {
        return self[propertyName];
      }
      return remoteFunction();
    }
  }
}
