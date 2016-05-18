interface Alert {
    AlertID: number;
    StartRoadwayLocation: RoadwayLocation;
    EndRoadwayLocation: RoadwayLocation;
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

interface RoadwayLocation {
    Description: string;
    RoadName: string;
    Direction: string;
    MilePost: number;
    Latitude: number;
    Longitude: number;
}

interface BorderCrossingData {
    Time: Date;
    CrossingName: string;
    BorderCrossingLocation: RoadwayLocation;
    WaitTime: number;
}

interface Camera {
    CameraID: number;
    Region: string;
    CameraLocation: RoadwayLocation;
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

// type RestrictionType = { "restriction" | "bridge" | "road" };

interface CVRestrictionData {
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
    Latitude: number;
    Longitude: number;
    BridgeNumber: string;
    MaximumGrossVehicleWeightInPounds: number;
    BridgeName: string;
    BLMaxAxle: number;
    CL8MaxAxle: number;
    SAMaxAxle: number;
    TDMaxAxle: number;
    VehicleType: string;
    RestrictionType: string; //CommercialVehicleRestrictionType;
}

interface TravelRestriction {
    TravelDirection: string;
    RestrictionText: string;
}

interface PassCondition {
    MountainPassId: number;
    MountainPassName: string;
    Latitude: number;
    Longitude: number;
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

interface TravelTimeRoute {
    TravelTimeID: number;
    Name: string;
    Description: string;
    TimeUpdated: Date;
    StartPoint: RoadwayLocation;
    EndPoint: RoadwayLocation;
    Distance: number;
    AverageTime: number;
    CurrentTime: number;
}

interface WeatherInfo {
    StationID: number;
    StationName: string;
    Latitude: number;
    Longitude: number;
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

interface WeatherStationData {
    StationCode: number;
    StationName: string;
    Latitude: number;
    Longitude: number;
}