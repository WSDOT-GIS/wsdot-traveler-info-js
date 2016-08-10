declare namespace Flattened {

    interface Point {
        StartDescription: string;
        StartRoadName: string;
        StartDirection: string;
        StartMilePost: number;
        StartLatitude: number;
        StartLongitude: number;
    }

    interface MultiPoint extends Point {
        EndDescription: string;
        EndRoadName: string;
        EndDirection: string;
        EndMilePost: number;
        EndLatitude: number;
        EndLongitude: number;
    }

    interface Alert extends AlertCommon, MultiPoint {

    }

    interface Camera extends CameraCommon, Point {

    }

    interface TravelTimeRoute extends TravelTimeRouteCommon, MultiPoint {
        TravelTimeID: number;
        Name: string;
        Description: string;
        TimeUpdated: Date;
        Distance: number;
        AverageTime: number;
        CurrentTime: number;
    }
}