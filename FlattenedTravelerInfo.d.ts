import { AlertCommon, CameraCommon, TravelTimeRouteCommon } from "./TravelerInfo";

export interface Point {
    StartDescription: string;
    StartRoadName: string;
    StartDirection: string;
    StartMilePost: number;
    StartCoordinates: [number, number];
}

export interface MultiPoint extends Point {
    EndDescription: string;
    EndRoadName: string;
    EndDirection: string;
    EndMilePost: number;
    EndCoordinates: [number, number];
}

export interface Alert extends AlertCommon, MultiPoint {

}

export interface Camera extends CameraCommon, Point {

}

export interface TravelTimeRoute extends TravelTimeRouteCommon, MultiPoint {
    TravelTimeID: number;
    Name: string;
    Description: string;
    TimeUpdated: Date;
    Distance: number;
    AverageTime: number;
    CurrentTime: number;
}