export interface Multipoint {
  StartLatitude: number;
  StartLongitude: number;
  EndLongitude: number;
  EndLatitude: number;
}

export interface HasStartAndEndMP {
  StartMilepost: number;
  EndMilepost: number;
}

/**
 * Toll information for HOV toll lanes
 * Attention: The tolls reported here may not match what is currently
 * displayed on the road signs due to timing issues between WSDOT
 * and the tolling contractor
 */
export interface TollRate extends Multipoint, HasStartAndEndMP {
  /** Message displayed on the sign in place of a toll */
  CurrentMessage: string | null;
  /**
   * The computed toll in cents which is sent to the tolling company,
   * may not match what is displayed on the sign due to timing issues
   */
  CurrentToll: number; // int;
  /** Approximate geographical latitude of the end location */
  EndLatitude: number; // decimal;
  /** Common name of the end location */
  EndLocationName: string;
  /** Approximate geographical longitude of the end location */
  EndLongitude: number; // decimal;
  /** The end milepost for a toll trip */
  EndMilepost: number; // decimal;
  /** Sign name (in docs but not actually in response) */
  SignName?: string;
  /** Approximate geographical latitude of the start location */
  StartLatitude: number; // decimal;
  /** Common name of the start location */
  StartLocationName: string;
  /** Approximate geographical longitude of the start location */
  StartLongitude: number; // decimal;
  /** The start milepost for a toll trip */
  StartMilepost: number; // decimal;
  /** Route the toll applies to */
  StateRoute: string;
  /** Travel direction the toll applies to */
  TravelDirection: string;
  /** Name for the toll trip */
  TripName: string;
}
