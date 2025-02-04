"use client";

import { useState, useRef } from 'react';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';
import axiosInstance from '@/utils/axios';
import debounce from 'lodash.debounce';
import type { AirportResponseType, LocationData } from '@/types/airport';
import { BsAirplane, BsGeoAltFill } from "react-icons/bs";
import { useClickOutside } from '@/utils/hooks';


interface LocationSelectProps {
    placeholder: string;
    icon: string;
    onSelect: (location: LocationData) => void;
}

// This component is used to select flight locations: departure and arrival
function LocationSelect({ placeholder, icon, onSelect }: LocationSelectProps) {

    const ref = useRef<HTMLDivElement | null>(null)

    const [isSearching, setIsSearching] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [query, setQuery] = useState('');
    const [response, setResponse] = useState<AirportResponseType | null>(null);
    const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);

    useClickOutside(ref, () => {
        setIsSearching(false);
        if (selectedLocation) {
            setQuery(selectedLocation.presentation.suggestionTitle);
        } else {
            setQuery('');
        }
    })

    const onSearch = (e: any) => {
        setIsSearching(e.target.value.length > 0)
        setQuery(e.target.value);

        if (e.target.value.length === 0) return

        const debouncedSearch = debounce((q) => {
            searchLocation(q);
        }, 500);

        debouncedSearch(query);
    }

    const searchLocation = async (q: string) => {
        setIsLoading(true);
        try {
            const response = await axiosInstance.get(`/api/v1/flights/searchAirport?query=${q}&locale=en-US`);
            setResponse(response.data);
        } catch (error) {
            console.error(error);
            setResponse(null);
        }
        setIsLoading(false);
    }

    const onSelectLocation = (location: LocationData) => {
        onSelect(location);
        setIsSearching(false);
        setSelectedLocation(location);
        setQuery(location.presentation.suggestionTitle);
    }

    return (
        <div ref={ref} className='flex align-items-center w-full'>
            <div className="relative w-full">
                <IconField iconPosition="left">
                    <InputIcon className={icon}> </InputIcon>
                    <InputText value={query} placeholder={placeholder} onChange={onSearch} />
                </IconField>
                <div hidden={!isSearching} className='absolute mt-1 w-[22rem] bg-white shadow-lg rounded-br rounded-bl m-auto max-h-[350px] overflow-y-auto z-10'>
                    <div className='flex flex-col h-full'>
                        {isLoading && <div className='my-5 text-center'><i className="pi pi-spin pi-spinner" style={{ fontSize: '1rem' }}></i></div>}
                        {!isLoading && response && response?.data?.length === 0 && <div className='my-5 text-center'>No results found</div>}
                        {!isLoading && response && response?.data?.length > 0 && (
                            <div hidden={isLoading} className='flex flex-col w-full'>
                                {response && response?.data?.map((airport: LocationData) => (
                                    <div key={airport.navigation.entityId} className='flex px-4 py-3 w-full hover:bg-gray-100 cursor-pointer' onClick={() => onSelectLocation(airport)}>
                                        <div className='mr-4 text-xl mt-2'>
                                            {airport.navigation.entityType == 'CITY' ? <BsGeoAltFill /> : <BsAirplane />}
                                        </div>
                                        <div>
                                            <p className='text-base'>{airport.presentation.suggestionTitle}</p>
                                            <p className='text-xs font-semibold'>{airport.presentation.subtitle}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LocationSelect;