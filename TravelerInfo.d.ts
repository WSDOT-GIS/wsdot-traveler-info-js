interface LatLong {
    Latitude: number;
    Longitude: number;
}

interface AlertCommon {
    AlertID: number;
    Region: string;
    County: string;
    StartTime: Date;
    EndTime: Date;
    EventCategory: string;
    HeadlineDescription: string;
    ExtendedDescription: string;
    EventStatus: string;
    LastUpdatedTime: Date;
    Priority: string;
}

interface Alert extends AlertCommon {
    StartRoadwayLocation: RoadwayLocation;
    EndRoadwayLocation: RoadwayLocation;
}

interface MapArea {
    MapArea: string;
    MapAreaDescription: string;
}

interface RoadwayLocation extends LatLong {
    Description: string;
    RoadName: string;
    Direction: string;
    MilePost: number;
}

interface BorderCrossingData {
    Time: Date;
    CrossingName: string;
    BorderCrossingLocation: RoadwayLocation;
    WaitTime: number;
}

interface CameraCommon {
    CameraID: number;
    Region: string;
    DisplayLatitude: number;
    DisplayLongitude: number;
    Title: string;
    Description: string;
    ImageURL: string;
    CameraOwner: string;
    OwnerURL: string;
    ImageWidth: number;
    ImageHeight: number;
    IsActive: boolean;
    SortOrder: number;
}

interface Camera extends CameraCommon {
    CameraLocation: RoadwayLocation;
}

type CommercialVehicleRestrictionType = "restriction" | "bridge" | "road";

interface CVRestrictionData extends LatLong {
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

interface TravelRestriction {
    TravelDirection: string;
    RestrictionText: string;
}

interface PassCondition extends LatLong {
    MountainPassId: number;
    MountainPassName: string;
    DateUpdated: Date;
    TemperatureInFahrenheit: number;
    ElevationInFeet: number;
    WeatherCondition: string;
    RoadCondition: string;
    TravelAdvisoryActive: boolean;
    RestrictionOne: TravelRestriction;
    RestrictionTwo: TravelRestriction;
}

interface FlowData {
    FlowDataID: number;
    Time: Date;
    StationName: string;
    Region: string;
    FlowStationLocation: RoadwayLocation;
    FlowReadingValue: number; // FlowStationReading;
}

interface TravelTimeRouteCommon {
    TravelTimeID: number;
    Name: string;
    Description: string;
    TimeUpdated: Date;
    Distance: number;
    AverageTime: number;
    CurrentTime: number;
}

interface TravelTimeRoute extends TravelTimeRouteCommon {
    StartPoint: RoadwayLocation;
    EndPoint: RoadwayLocation;
}

interface WeatherCommon extends LatLong {
    StationName: string;
}

interface WeatherInfo extends WeatherCommon, LatLong {
    StationID: number;
    ReadingTime: Date;
    TemperatureInFahrenheit: number;
    PrecipitationInInches: number;
    WindSpeedInMPH: number;
    Visibility: number;
    SkyCoverage: string;
    BarametricPressure: number;
    RelativeHumidity: number;
    WindDirectionCardinal: string;
    WindDirection: number;
}

interface WeatherStationData extends WeatherCommon, LatLong {
    StationCode: number;
}