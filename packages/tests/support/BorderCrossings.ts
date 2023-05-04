import { BorderCrossingData } from "wsdot-traveler-info";

/**
 * Provides sample border crossing data.
 */
const bc: BorderCrossingData[] = [
  {
    BorderCrossingLocation: {
      Description: "I-5 General Purpose",
      Direction: null,
      Latitude: 49.004776,
      Longitude: -122.756964,
      MilePost: 0,
      RoadName: "005"
    },
    CrossingName: "I5",
    Time: new Date(1477521300000 - 700),
    WaitTime: 5
  },
  {
    BorderCrossingLocation: {
      Description: "I-5 Nexus Lane",
      Direction: null,
      Latitude: 49.004776,
      Longitude: -122.756964,
      MilePost: 0,
      RoadName: "005"
    },
    CrossingName: "I5Nexus",
    Time: new Date(1477521300000 - 700),
    WaitTime: 5
  },
  {
    BorderCrossingLocation: {
      Description: "SR 539 General Purpose",
      Direction: null,
      Latitude: 49.002344,
      Longitude: -122.484937,
      MilePost: 0,
      RoadName: "539"
    },
    CrossingName: "SR539",
    Time: new Date(1477521300000 - 700),
    WaitTime: 5
  },
  {
    BorderCrossingLocation: null,
    CrossingName: "SR539Nexus",
    Time: new Date(1477521300000 - 700),
    WaitTime: 5
  },
  {
    BorderCrossingLocation: null,
    CrossingName: "SR539Trucks",
    Time: new Date(1477521300000 - 700),
    WaitTime: 5
  },
  {
    BorderCrossingLocation: {
      Description: "SR 543 General Purpose",
      Direction: null,
      Latitude: 49.002948,
      Longitude: -122.734682,
      MilePost: 0,
      RoadName: "543"
    },
    CrossingName: "SR543",
    Time: new Date(1477521300000 - 700),
    WaitTime: 5
  },
  {
    BorderCrossingLocation: {
      Description: "SR 543 Nexus Lane",
      Direction: null,
      Latitude: 49.002948,
      Longitude: -122.734682,
      MilePost: 0,
      RoadName: "543"
    },
    CrossingName: "SR543Nexus",
    Time: new Date(1477521300000 - 700),
    WaitTime: 5
  },
  {
    BorderCrossingLocation: {
      Description: "SR 543 Trucks",
      Direction: null,
      Latitude: 49.002941,
      Longitude: -122.733655,
      MilePost: 0,
      RoadName: "543"
    },
    CrossingName: "SR543Trucks",
    Time: new Date(1477521300000 - 700),
    WaitTime: 35
  },
  {
    BorderCrossingLocation: {
      Description: "SR 543 Trucks FAST Lane",
      Direction: null,
      Latitude: 49.002941,
      Longitude: -122.733655,
      MilePost: 0,
      RoadName: "543"
    },
    CrossingName: "SR543TrucksFast",
    Time: new Date(1477521300000 - 700),
    WaitTime: 15
  },
  {
    BorderCrossingLocation: {
      Description: "SR 9 General Purpose",
      Direction: null,
      Latitude: 49.002471,
      Longitude: -122.265068,
      MilePost: 0,
      RoadName: "009"
    },
    CrossingName: "SR9",
    Time: new Date(1477521300000 - 700),
    WaitTime: 5
  },
  {
    BorderCrossingLocation: {
      Description: "US 97",
      Direction: null,
      Latitude: 49.000712,
      Longitude: -119.462672,
      MilePost: 0,
      RoadName: "097"
    },
    CrossingName: "SR97",
    Time: new Date(1477521300000 - 700),
    WaitTime: -1
  },
  {
    BorderCrossingLocation: {
      Description: "SR 9 Nexus",
      Direction: null,
      Latitude: 49.001932,
      Longitude: -122.265762,
      MilePost: 0,
      RoadName: "009"
    },
    CrossingName: "SR9Nexus",
    Time: new Date(1477521300000 - 700),
    WaitTime: 5
  }
];

export default bc;
