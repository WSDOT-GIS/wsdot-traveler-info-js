import type { Alert, TravelTimeRoute } from "./TravelerInfo";
export type * from "./WebApi";
export * from "./CommonUtils";
export type * from "./Ferries";
export * from "./FerriesClient";
export type {
  Camera,
  MultiPoint,
  Point,
  TravelTimeRoute,
  Alert,
} from "./FlattenedTravelerInfo";
export * from "./geoJsonUtils";
export type * from "./TravelerInfo";
export * from "./TravelerInfoClient";

export const defaultApiRoot = new URL("https://www.wsdot.wa.gov/Traffic/api/");

/**
 * Detects if the input object is an {@link Alert}
 * @param input - Input object
 * @returns Returns true if {@link input} is of the expected type, false otherwise.
 */
export function isAlert(input: object): input is Alert {
  return input && Object.hasOwn(input, "AlertID" as keyof Alert);
}

/**
 * Detects if the input object is an {@link TravelTimeRoute}
 * @param input - Input object
 * @returns Returns true if {@link input} is of the expected type, false otherwise.
 */
export function isTravelTimeRoute(input: object): input is TravelTimeRoute {
  return input && Object.hasOwn(input, "TravelTimeID" as keyof TravelTimeRoute);
}

/*
 * Examines an object and determines if it should be represented by as a MultiPoint (rather than Point);
 */
export function detectMultipoint(
  input: object
): input is Alert | TravelTimeRoute {
  return isAlert(input) || isTravelTimeRoute(input);
}
