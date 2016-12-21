import { PassCondition } from "../../TravelerInfo";


/**
 * Provides sample Pass Conditions
 */
let mpc: PassCondition[] = [
  {
    "DateUpdated": new Date(1477521223197 - 700),
    "ElevationInFeet": 4102,
    "Latitude": 47.335298205152,
    "Longitude": -120.581068215668,
    "MountainPassId": 1,
    "MountainPassName": "Blewett Pass US97",
    "RestrictionOne": {
      "RestrictionText": "No restrictions",
      "TravelDirection": "Northbound"
    },
    "RestrictionTwo": {
      "RestrictionText": "No restrictions",
      "TravelDirection": "Southbound"
    },
    "RoadCondition": "Pass is open. ",
    "TemperatureInFahrenheit": 42,
    "TravelAdvisoryActive": true,
    "WeatherCondition": ""
  },
  {
    "DateUpdated": new Date(1477520500210 - 700),
    "ElevationInFeet": 4675,
    "Latitude": 46.7837710531657,
    "Longitude": -121.553651866999,
    "MountainPassId": 2,
    "MountainPassName": "Cayuse Pass SR123",
    "RestrictionOne": {
      "RestrictionText": "No restrictions",
      "TravelDirection": "Northbound"
    },
    "RestrictionTwo": {
      "RestrictionText": "No restrictions",
      "TravelDirection": "Southbound"
    },
    "RoadCondition": "Roadway is bare and dry",
    "TemperatureInFahrenheit": 40,
    "TravelAdvisoryActive": true,
    "WeatherCondition": "Overcast skies"
  },
  {
    "DateUpdated": new Date(1477521518210 - 700),
    "ElevationInFeet": 5430,
    "Latitude": 46.8717,
    "Longitude": -121.515483,
    "MountainPassId": 3,
    "MountainPassName": "Chinook Pass SR410",
    "RestrictionOne": {
      "RestrictionText": "No restrictions",
      "TravelDirection": "Eastbound"
    },
    "RestrictionTwo": {
      "RestrictionText": "No restrictions",
      "TravelDirection": "Westbound"
    },
    "RoadCondition": "Roadway is bare and wet",
    "TemperatureInFahrenheit": 44,
    "TravelAdvisoryActive": true,
    "WeatherCondition": "Light rain"
  },
  {
    "DateUpdated": new Date(1477520521210 - 700),
    "ElevationInFeet": 2600,
    "Latitude": 47.1185288413862,
    "Longitude": -121.609452047994,
    "MountainPassId": 5,
    "MountainPassName": "Crystal to Greenwater SR410",
    "RestrictionOne": {
      "RestrictionText": "No restrictions",
      "TravelDirection": "Eastbound"
    },
    "RestrictionTwo": {
      "RestrictionText": "No restrictions",
      "TravelDirection": "Westbound"
    },
    "RoadCondition": "The roadway is bare and dry",
    "TemperatureInFahrenheit": 40,
    "TravelAdvisoryActive": true,
    "WeatherCondition": "Overcast skies"
  },
  {
    "DateUpdated": new Date(1477484518723 - 700),
    "ElevationInFeet": 3252,
    "Latitude": 48.43,
    "Longitude": -119.1,
    "MountainPassId": 15,
    "MountainPassName": "Disautel Pass SR 155",
    "RestrictionOne": {
      "RestrictionText": "No restrictions",
      "TravelDirection": "Northbound"
    },
    "RestrictionTwo": {
      "RestrictionText": "No restrictions",
      "TravelDirection": "Southbound"
    },
    "RoadCondition": "Pass is open",
    "TemperatureInFahrenheit": null,
    "TravelAdvisoryActive": false,
    "WeatherCondition": ""
  },
  {
    "DateUpdated": new Date(1477484518723 - 700),
    "ElevationInFeet": 4020,
    "Latitude": 48.393823,
    "Longitude": -119.91147,
    "MountainPassId": 14,
    "MountainPassName": "Loup Loup Pass SR20",
    "RestrictionOne": {
      "RestrictionText": "No restrictions",
      "TravelDirection": "Eastbound"
    },
    "RestrictionTwo": {
      "RestrictionText": "No restrictions",
      "TravelDirection": "Westbound"
    },
    "RoadCondition": "Pass is open",
    "TemperatureInFahrenheit": 42,
    "TravelAdvisoryActive": false,
    "WeatherCondition": ""
  },
  {
    "DateUpdated": new Date(1477521057210 - 700),
    "ElevationInFeet": 2672,
    "Latitude": 46.881665325614,
    "Longitude": -120.424877484162,
    "MountainPassId": 13,
    "MountainPassName": "Manastash Ridge I-82",
    "RestrictionOne": {
      "RestrictionText": "No restrictions",
      "TravelDirection": "Eastbound"
    },
    "RestrictionTwo": {
      "RestrictionText": "No restrictions",
      "TravelDirection": "Westbound"
    },
    "RoadCondition": "Pass is open. ",
    "TemperatureInFahrenheit": 48,
    "TravelAdvisoryActive": true,
    "WeatherCondition": ""
  },
  {
    "DateUpdated": new Date(1477520777210 - 700),
    "ElevationInFeet": 4250,
    "Latitude": 48.777343,
    "Longitude": -121.813201,
    "MountainPassId": 6,
    "MountainPassName": "Mt. Baker Hwy SR542",
    "RestrictionOne": {
      "RestrictionText": "No restrictions",
      "TravelDirection": "Eastbound"
    },
    "RestrictionTwo": {
      "RestrictionText": "No restrictions",
      "TravelDirection": "Westbound"
    },
    "RoadCondition": "Pass is open. ",
    "TemperatureInFahrenheit": null,
    "TravelAdvisoryActive": true,
    "WeatherCondition": ""
  },
  {
    "DateUpdated": new Date(1477515274380 - 700),
    "ElevationInFeet": 5477,
    "Latitude": 48.5905,
    "Longitude": -120.4,
    "MountainPassId": 7,
    "MountainPassName": "North Cascade Hwy SR20",
    "RestrictionOne": {
      "RestrictionText": "No restrictions",
      "TravelDirection": "Eastbound"
    },
    "RestrictionTwo": {
      "RestrictionText": "No restrictions",
      "TravelDirection": "Westbound"
    },
    "RoadCondition": "Pass is open. Snow on the roadway",
    "TemperatureInFahrenheit": 33,
    "TravelAdvisoryActive": true,
    "WeatherCondition": "Snowing"
  },
  {
    "DateUpdated": new Date(1477521433210 - 700),
    "ElevationInFeet": 3107,
    "Latitude": 45.984722,
    "Longitude": -120.653611,
    "MountainPassId": 8,
    "MountainPassName": "Satus Pass US97",
    "RestrictionOne": {
      "RestrictionText": "No restrictions",
      "TravelDirection": "Northbound"
    },
    "RestrictionTwo": {
      "RestrictionText": "No restrictions",
      "TravelDirection": "Southbound"
    },
    "RoadCondition": "Pass is open. ",
    "TemperatureInFahrenheit": 51,
    "TravelAdvisoryActive": true,
    "WeatherCondition": ""
  },
  {
    "DateUpdated": new Date(1477520956210 - 700),
    "ElevationInFeet": 5575,
    "Latitude": 48.606667,
    "Longitude": -118.48,
    "MountainPassId": 9,
    "MountainPassName": "Sherman Pass SR20",
    "RestrictionOne": {
      "RestrictionText": "No restrictions",
      "TravelDirection": "Eastbound"
    },
    "RestrictionTwo": {
      "RestrictionText": "No restrictions",
      "TravelDirection": "Westbound"
    },
    "RoadCondition": "Pass is open. ",
    "TemperatureInFahrenheit": 37,
    "TravelAdvisoryActive": true,
    "WeatherCondition": ""
  },
  {
    "DateUpdated": new Date(1477520644210 - 700),
    "ElevationInFeet": 3022,
    "Latitude": 47.41,
    "Longitude": -121.405833,
    "MountainPassId": 11,
    "MountainPassName": "Snoqualmie Pass I-90",
    "RestrictionOne": {
      "RestrictionText": "No restrictions",
      "TravelDirection": "Eastbound"
    },
    "RestrictionTwo": {
      "RestrictionText": "No restrictions",
      "TravelDirection": "Westbound"
    },
    "RoadCondition": "",
    "TemperatureInFahrenheit": 45,
    "TravelAdvisoryActive": true,
    "WeatherCondition": ""
  },
  {
    "DateUpdated": new Date(1477520570210 - 700),
    "ElevationInFeet": 4061,
    "Latitude": 47.745,
    "Longitude": -121.093333,
    "MountainPassId": 10,
    "MountainPassName": "Stevens Pass US2",
    "RestrictionOne": {
      "RestrictionText": "No restrictions",
      "TravelDirection": "Eastbound"
    },
    "RestrictionTwo": {
      "RestrictionText": "No restrictions",
      "TravelDirection": "Westbound"
    },
    "RoadCondition": "Pass is open. ",
    "TemperatureInFahrenheit": 41,
    "TravelAdvisoryActive": true,
    "WeatherCondition": ""
  },
  {
    "DateUpdated": new Date(1477484518727 - 700),
    "ElevationInFeet": 4310,
    "Latitude": 48.726184868904,
    "Longitude": -118.959520117102,
    "MountainPassId": 16,
    "MountainPassName": "Wauconda Pass SR20",
    "RestrictionOne": {
      "RestrictionText": "No restrictions",
      "TravelDirection": "Eastbound"
    },
    "RestrictionTwo": {
      "RestrictionText": "No restrictions",
      "TravelDirection": "Westbound"
    },
    "RoadCondition": "Pass is open.",
    "TemperatureInFahrenheit": 42,
    "TravelAdvisoryActive": false,
    "WeatherCondition": ""
  },
  {
    "DateUpdated": new Date(1477521229210 - 700),
    "ElevationInFeet": 4500,
    "Latitude": 46.638333,
    "Longitude": -121.39,
    "MountainPassId": 12,
    "MountainPassName": "White Pass US12",
    "RestrictionOne": {
      "RestrictionText": "No restrictions",
      "TravelDirection": "Eastbound"
    },
    "RestrictionTwo": {
      "RestrictionText": "No restrictions",
      "TravelDirection": "Westbound"
    },
    "RoadCondition": "Roadway is bare and wet",
    "TemperatureInFahrenheit": 44,
    "TravelAdvisoryActive": true,
    "WeatherCondition": "Light rain"
  }
];

export default mpc;