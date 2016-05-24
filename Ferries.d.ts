/**
 * Ferries API data types.
 * @see {@link http://www.wsdot.wa.gov/ferries/api/fares/documentation/index.html|WSF Fares API}
 */

interface DateRange {
    DateFrom: Date,
    DateThru: Date
}

interface Terminal {
    TerminalID: number, // integer
    Description: string
}

interface TerminalCombo {
    DepartingDescription: string,
    ArrivingDescription: string,
    CollectionDescription: string
}

interface TerminalComboVerbose extends TerminalCombo {
    DepartingTerminalId: number, // integer
    ArrivingTerminalId: number, // integer
}

interface FareLineItem {
    FareLineItemID: number, // integer
    FareLineItem: string,
    Category: string,
    DirectionIndependent: boolean,
    Amount: number // decimal
}

interface LineItemXref {
    TerminalComboIndex: number,
    LineItemIndex: number,
    RoundTripLineItemIndex: number,
}

interface VerboseFareLineItem {
    TerminalComboVerbose: TerminalComboVerbose[]
    LineItemXref: LineItemXref[],
    LineItems: FareLineItem[],
    RoundTripLineItems: FareLineItem[]
}

declare enum FareTotalType  { 
    Departing = 1,
    Return = 2,
    Either = 3, //Departing | Return,
    Total = 4
}

interface FareTotal {
    FareTotalType: FareTotalType,
    Description: string,
    BreifDescription: string,
    Amount: number
}