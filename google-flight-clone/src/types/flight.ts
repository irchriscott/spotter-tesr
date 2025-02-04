type FlightResponseType = {
    data: FlightData;
    sessionId: string;
    timestamp: number;
    status: boolean;
}

type FlightData = {
    filterStats: FilterStats;
    flightsSessionId: string;
    itineraries: Flight[];
}

type FilterStats = {
    airports: AirportCity[];
    carriers: Carrier[];
    duration: {
        min: number;
        max: number;
        multiCityMin: number;
        multiCityMax: number;
    }
}

type AirportCity = {
    airports: Airport[];
    city: string;
}

type Airport = {
    entityId: string;
    id: string;
    name: string;
}


type Flight = {
    id: string;
    price: {
        raw: number;
        formatted: string;
        pricingOptionId: string;
    };
    legs: Leg[];
    isSelfTransfer: boolean;
    isProtectedSelfTransfer: boolean;
    farePolicy: {
        isChangeAllowed: boolean;
        isPartiallyChangeable: boolean;
        isCancellationAllowed: boolean;
        isPartiallyRefundable: boolean;
    };
    fareAttributes: Record<string, any>;
    tags?: string[];
    isMashUp: boolean;
    hasFlexibleOptions: boolean;
    score?: number;
};

type Leg = {
    id: string;
    origin: Location;
    destination: Location;
    durationInMinutes: number;
    stopCount: number;
    isSmallestStops: boolean;
    departure: string; 
    arrival: string;
    timeDeltaInDays: number;
    carriers: {
        marketing: Carrier[];
        operating?: Carrier[];
        operationType: string;
    };
    segments: Segment[];
};

type Location = {
    id: string;
    entityId: string;
    name: string;
    displayCode: string;
    city: string;
    country: string;
    isHighlighted: boolean;
};

type Carrier = {
    id: number;
    alternateId?: string;
    logoUrl?: string;
    name: string;
};

type Segment = {
    id: string;
    origin: FlightPlace;
    destination: FlightPlace;
    departure: string;
    arrival: string;
    durationInMinutes: number;
    flightNumber: string;
    marketingCarrier: Airline;
    operatingCarrier: Airline;
};

type FlightPlace = {
    flightPlaceId: string;
    displayCode: string;
    parent?: {
        flightPlaceId: string;
        displayCode: string;
        name: string;
        type: string;
    };
    name: string;
    type: string;
    country: string;
};

type Airline = {
    id: number;
    name: string;
    alternateId?: string;
    allianceId?: number;
    displayCode?: string;
};

export type { FlightResponseType, FlightData, Flight, Leg, Location, Carrier, Segment, FlightPlace, Airline, AirportCity, Airport, FilterStats };