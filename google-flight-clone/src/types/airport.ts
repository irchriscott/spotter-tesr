type AirportResponseType = {
    status: boolean;
    timestamp: number;
    data: LocationData[];
};

type LocationData = {
    skyId: string;
    entityId: string;
    presentation: Presentation;
    navigation: Navigation;
};

type Presentation = {
    title: string;
    suggestionTitle: string;
    subtitle: string;
};

type Navigation = {
    entityId: string;
    entityType: "CITY" | "AIRPORT";
    localizedName: string;
    relevantFlightParams: RelevantParams;
    relevantHotelParams: RelevantParams;
};

type RelevantParams = {
    skyId?: string;
    entityId: string;
    flightPlaceType?: "CITY" | "AIRPORT";
    entityType?: "CITY" | "AIRPORT";
    localizedName: string;
};

export type { AirportResponseType, LocationData, Presentation, Navigation, RelevantParams };