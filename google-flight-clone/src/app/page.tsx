"use client";

import { useState, useRef } from "react";
import { Dropdown } from 'primereact/dropdown';
import { Button } from "primereact/button";
import { Messages } from 'primereact/messages';
import { DataView } from 'primereact/dataview';

import FlightDetails from "@/components/flight";
import FlightTypeInputSelect from "@/components/flight-type-select";
import PeopleCountSelect from "@/components/people-count-select";
import LocationSelect from "@/components/location-select";
import DateSelect from "@/components/dates-select";
import axiosInstance from "@/utils/axios";

import type { SelectOption } from "@/types/input";
import type { LocationData } from "@/types/airport";
import type { PeopleCount } from "@/types/people";
import type { FlightResponseType, Flight } from "@/types/flight";

const seatTypes : SelectOption[] = [
  { value: 'economy', label: 'Economy' },
  { value: 'premium_economy', label: 'Premium economy' },
  { value: 'business', label: 'Business' },
  { value: 'first', label: 'First Class' }
]

export default function Home() {

  const messagesRef = useRef<Messages>(null);

  const [flightType, setFlightType] = useState<string>('1');
  const [peopleCount, setPeopleCount] = useState<PeopleCount>({ adults: 1, children: 0, infants: 0 });
  const [seatType, setSeatType] = useState<string>('economy');

  const [fromLocation, setFromLocation] = useState<LocationData | null>(null);
  const [toLocation, setToLocation] = useState<LocationData | null>(null);

  const [departureDate, setDepartureDate] = useState<Date | null>(null);
  const [returnDate, setReturnDate] = useState<Date | null>(null);

  const [flights, setFlights] = useState<FlightResponseType | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const onSeatTypeChange = (e: any) => {
    setSeatType(e.value);
  }

  //Search flights based on the selected locations and dates
  const onSearchFlights = async () => {

    messagesRef.current?.clear();

    if (!fromLocation || !toLocation || !departureDate) {
      messagesRef.current?.show({ severity: 'error', summary: 'Error', detail: 'Please fill all the fields', closable: false});
      return;
    }

    if (flightType === '1' && !returnDate) {
      messagesRef.current?.show({ severity: 'error', summary: 'Error', detail: 'Please fill all the fields', closable: false});
      return;
    }

    setFlights(null);
    setIsSearching(true);

    try {
      const response = await axiosInstance.get('/api/v2/flights/searchFlights', {
        params: {
          originSkyId: fromLocation.skyId,
          destinationSkyId: toLocation.skyId,
          originEntityId: fromLocation.entityId,
          destinationEntityId: toLocation.entityId,
          date: departureDate.toISOString().split('T')[0],
          returnDate: flightType === '1' ? returnDate?.toISOString().split('T')[0] : null,
          cabinClass: seatType,
          adults: peopleCount.adults,
          children: peopleCount.children,
          infants: peopleCount.infants
        }
      });

      setFlights(response.data);

    } catch (error) {
      console.error(error);
      setFlights(null);
      messagesRef.current?.show({ severity: 'error', summary: 'Error', detail: 'Something went wrong', closable: false});
    }

    setIsSearching(false);
  }

  //List template for the flight data
  const listTemplate = (flights: Flight[]) => {
      if (!flights || flights.length === 0) return null;

      const list = flights.map((flight, index) => {
            return (<FlightDetails key={index} flight={flight} index={index} />);
      });

      return <div className="grid grid-nogutter">{list}</div>;
  }

  return (
    <div className="min-h-screen pb-20 py-0 my-0 font-[family-name:var(--font-geist-sans)] max-w-[1248px] mx-auto">
      <main className="flex flex-col gap-0 row-start-2 items-center sm:items-start">
        <div className="relative w-full overflow-hidden h-[24vh]">
          <div className="bg-[url('/flights-bg-light.svg')] bg-cover bg-center top-bg-image w-full max-w-[1248px]"></div>
        </div>
        
        <div className="px-6 sm:px-4 w-full relative">
          <h2 className="text-center text-5xl font-medium">Flights</h2>

          <div className="relative px-4 pt-4 pb-[40px] mt-[3rem] mx-[3rem] bg-[#FFFFFF] rounded-lg shadow-md ring-2 ring-gray-100">
            <div className="flex gap-4">
              <FlightTypeInputSelect placeholder="" value={flightType} onChange={(v) => {
                setFlightType(v.value);
              }} />

              <PeopleCountSelect onDone={(people) => {
                setPeopleCount(people);
              }} />

              <Dropdown 
                value={seatType} 
                onChange={onSeatTypeChange} 
                options={seatTypes} 
                optionLabel="label" 
                placeholder="" 
                className="text-sm-dropdown" 
                checkmark={true}
                highlightOnSelect={true} 
              />
            </div>
            <div className="mt-2">
              <div className="flex gap-4 w-full">
                <div className="flex-1">
                  <LocationSelect placeholder="Where From ?" icon="pi pi-map-marker" onSelect={setFromLocation} />
                </div>
                <div className="flex-1">
                  <LocationSelect placeholder="Where To ?" icon="pi pi-map-marker" onSelect={setToLocation} />
                </div>
                <div className="flex-1">
                  <DateSelect placeholder="Depature" onSelect={setDepartureDate} />
                </div>
                {flightType === '1' && (
                  <div className="flex-1">
                    <DateSelect placeholder="Return" onSelect={setReturnDate} />
                  </div>
                )}
              </div>
            </div>
            <div className="absolute w-full items-center justify-center flex mt-5 z-1">
              <Button className="bg-blue-500 px-4 py-2 text-white rounded-full" label="Search" icon="pi pi-search" onClick={onSearchFlights} />
            </div>
          </div>

          <div className="mt-[40px] mx-[3rem]">
            <Messages ref={messagesRef}></Messages>
            {isSearching && <div className="text-center mt-[80px]"><i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem' }}></i></div>}
            {flights && (
              <div className="mt-5">
                <h3 className="text-2xl font-medium">Best Flights</h3>
                <div className="mt-3 card rounded-md shadow-md ring-1 ring-gray-100">
                  <DataView value={flights.data.itineraries} listTemplate={listTemplate} />
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
