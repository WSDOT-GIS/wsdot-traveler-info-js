/**
 * Ferries API data types.
 * @see {@link http://www.wsdot.wa.gov/ferries/api/fares/documentation/index.html|WSF Fares API}
 */

export interface DateRange {
  DateFrom: Date;
  DateThru: Date;
}

export interface Terminal {
  TerminalID: number; // integer
  Description: string;
}

export interface TerminalCombo {
  DepartingDescription: string;
  ArrivingDescription: string;
  CollectionDescription: string;
}

export interface TerminalComboVerbose extends TerminalCombo {
  DepartingTerminalId: number; // integer
  ArrivingTerminalId: number; // integer
}

export interface FareLineItem {
  FareLineItemID: number; // integer
  FareLineItem: string;
  Category: string;
  DirectionIndependent: boolean;
  Amount: number; // decimal
}

export interface LineItemXref {
  TerminalComboIndex: number;
  LineItemIndex: number;
  RoundTripLineItemIndex: number;
}

export interface VerboseFareLineItem {
  TerminalComboVerbose: TerminalComboVerbose[];
  LineItemXref: LineItemXref[];
  LineItems: FareLineItem[];
  RoundTripLineItems: FareLineItem[];
}

export declare enum FareTotalType {
  Departing = 1,
  Return = 2,
  Either = 3, // Departing | Return;
  Total = 4
}

export interface FareTotal {
  TotalType: FareTotalType;
  Description: string;
  BriefDescription: string;
  Amount: number;
}
