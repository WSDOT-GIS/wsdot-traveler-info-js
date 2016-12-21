export interface LatLong {
    Latitude: number;
    Longitude: number;
}

export interface AlertCommon {
    AlertID: number;
    Region: string;
    County: string | null;
    StartTime: Date;
    EndTime: Date | null;
    EventCategory: string;
    HeadlineDescription: string;
    ExtendedDescription: string | null;
    EventStatus: string;
    LastUpdatedTime: Date;
    Priority: string;
}

export interface Alert extends AlertCommon {
    StartRoadwayLocation: RoadwayLocation;
    EndRoadwayLocation: RoadwayLocation;
}

export interface MapArea {
    MapArea: string;
    MapAreaDescription: string;
}

export interface RoadwayLocation extends LatLong {
    Description: string | null;
    RoadName: string;
    Direction: string | null;
    MilePost: number;
}

export interface BorderCrossingData {
    Time: Date;
    CrossingName: string;
    BorderCrossingLocation: RoadwayLocation | null;
    WaitTime: number;
}

export interface CameraCommon {
    CameraID: number;
    Region: string;
    DisplayLatitude: number;
    DisplayLongitude: number;
    Title: string;
    Description: string | null;
    ImageURL: string | null;
    CameraOwner: string | null;
    OwnerURL: string | null;
    ImageWidth: number;
    ImageHeight: number;
    IsActive: boolean | null;
    SortOrder: number;
}

export interface Camera extends CameraCommon {
    CameraLocation: RoadwayLocation;
}

export type CommercialVehicleRestrictionType = "restriction" | "bridge" | "road";

export interface CVRestrictionData extends LatLong {
    StateRouteID: string;
    State: string;
    RestrictionWidthInInches: number;
    RestrictionHeightInInches: number;
    RestrictionLengthInInches: number;
    RestrictionWeightInPounds: number;
    IsDetourAvailable: boolean;
    IsPermanentRestriction: boolean;
    IsExceptionsAllowed: boolean;
    IsWarning: boolean;
    DatePosted: Date;
    DateEffective: Date;
    DateExpires: Date;
    LocationName: string;
    LocationDescription: string;
    RestrictionComment: string;
    BridgeNumber: string;
    MaximumGrossVehicleWeightInPounds: number;
    BridgeName: string;
    BLMaxAxle: number;
    CL8MaxAxle: number;
    SAMaxAxle: number;
    TDMaxAxle: number;
    VehicleType: string;
    RestrictionType: CommercialVehicleRestrictionType;
}

export interface TravelRestriction {
    TravelDirection: string;
    RestrictionText: string;
}

export interface PassCondition extends LatLong {
    MountainPassId: number;
    MountainPassName: string;
    DateUpdated: Date;
    TemperatureInFahrenheit: number | null;
    ElevationInFeet: number;
    WeatherCondition: string;
    RoadCondition: string;
    TravelAdvisoryActive: boolean;
    RestrictionOne: TravelRestriction;
    RestrictionTwo: TravelRestriction;
}

export interface FlowData {
    FlowDataID: number;
    Time: Date;
    StationName: string;
    Region: string;
    FlowStationLocation: RoadwayLocation;
    FlowReadingValue: number; // FlowStationReading;
}

export interface TravelTimeRouteCommon {
    TravelTimeID: number;
    Name: string;
    Description: string;
    TimeUpdated: Date;
    Distance: number;
    AverageTime: number;
    CurrentTime: number;
}

export interface TravelTimeRoute extends TravelTimeRouteCommon {
    StartPoint: RoadwayLocation;
    EndPoint: RoadwayLocation;
}

export interface WeatherCommon extends LatLong {
    StationName: string;
}

export type CardinalDirection =
    "N" | "S" | "E" | "W" |
    "NNE" | "NEE" | "NE" | "NW" | "NNW" | "NWW" |
    "SSE" | "SEE" | "SE" | "SW" | "SSW" | "SWW" |
    "N/A";


export interface WeatherInfo extends WeatherCommon, LatLong {
    StationID: number;
    ReadingTime: Date;
    TemperatureInFahrenheit: number | null;
    PrecipitationInInches: number | null;
    WindSpeedInMPH: number | null;
    Visibility: number | null;
    SkyCoverage: string;
    BarometricPressure: number | null;
    RelativeHumidity: number | null;
    WindDirectionCardinal: CardinalDirection; //string;
    WindDirection: number | null;
    WindGustSpeedInMPH: number | null,
}

export interface WeatherStationData extends WeatherCommon, LatLong {
    StationCode: number;
}