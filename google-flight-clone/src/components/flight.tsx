import { useState } from 'react';
import { Image } from 'primereact/image';
import { Tooltip } from 'primereact/tooltip';
import { Tag } from 'primereact/tag';
import { 
    formatDateToTime, 
    formatDateTimeDetails, 
    formatMinutes, 
    timeDifference 
} from '../utils/helpers';

import type { Flight, Segment } from '../types/flight';

interface FlightDetailsProps {
    flight: Flight;
    index: number;
}

interface FlightStopDetailsProps {
    segment: Segment;
    nextDeparture: string | null;
}

function FlightDetails ({ flight, index }: FlightDetailsProps) {

    const [showDetails, setShowDetails] = useState(false);

    console.log(flight);

    return (
        <div>
            <div onClick={() => {setShowDetails((v) => !v)}} style={{borderBottom: '1px solid #eee'}} className='grid grid-cols-11 gap-2 px-5 py-4 cursor-pointer hover:bg-gray-100' key={index}>
                <div className='text-center items-center'>
                    <Image src={flight.legs[0].carriers.marketing[0].logoUrl} alt={flight.legs[0].carriers.marketing[0].name} width='45' height='45' className='airline-logo-image' />
                </div>
                <div className='px-2 col-span-3 items-center'>
                    <Tooltip key="depature" target=".depature-time-flight" position="top" content={formatDateTimeDetails(flight.legs[0].departure)} />
                    <Tooltip key="arrival" target=".arrival-time-flight" position="top" content={formatDateTimeDetails(flight.legs[0].arrival)} />
                    <p className='font-bold text-l'><span className='depature-time-flight'>{formatDateToTime(flight.legs[0].departure)}</span> - <span className='arrival-time-flight'>{formatDateToTime(flight.legs[0].arrival)}</span></p>
                    <p className='font-medium text-sm'>{flight.legs[0].carriers.marketing[0].name}{flight.legs[0].carriers.operating && (<span> • {flight.legs[0].carriers.operating[0].name}</span>)}</p>
                </div>
                <div className='px-2 col-span-2 items-center'>
                    <p className='font-semibold'>{formatMinutes(flight.legs[0].durationInMinutes)}</p>
                    <p className='text-sm'>{flight.legs[0].origin.displayCode} - {flight.legs[0].destination.displayCode}</p>
                </div>
                <div className='px-2 col-span-2 items-center'>
                    {flight.legs[0].stopCount == 0 && <p className='font-medium'>Nonstop</p>}
                    {flight.legs[0].stopCount > 0 && (
                        <p className='font-medium'>{flight.legs[0].stopCount} stop{flight.legs[0].stopCount > 1 ? 's' : ''}</p>
                    )}
                    {flight.legs[0].stopCount > 0 && (
                        <>
                            <span className='text-sm'>{flight.legs[0].stopCount == 1 && flight.legs[0].segments.length > 1 && (<span>{formatMinutes(flight.legs[0].segments[1].durationInMinutes)}, {flight.legs[0].segments[1].origin.displayCode}</span>)}</span>
                            <span className='text-sm'>{flight.legs[0].stopCount > 1 && flight.legs[0].segments.length > 1 && (
                                <>
                                    {flight.legs[0].segments.slice(1).map((segment, index) => (
                                        <span key={index}>{segment.origin.displayCode} {index < flight.legs[0].segments.length - 2 && (<span> • </span>)}</span>
                                    ))}
                                </>
                            )}</span>
                        </>
                    )}
                </div>
                <div className='px-2 col-span-2 items-center'>
                    {flight?.tags && flight?.tags.map((tag, index) => (
                        <Tag key={index} value={tag.replaceAll('_', ' ')} severity="info" className='mr-1 mb-1' />
                    ))}
                    {flight?.score && <Tag value={(flight.score * 10).toFixed(1)} severity="success" />}
                </div>
                <div className='px-2 col-span-1 text-right items-center'>
                    <p className='font-semibold text-lg'>{flight.price.formatted}</p>
                </div>
            </div>
            {showDetails && (
                <div style={{borderBottom: '1px solid #ccc'}} className='gap-2 px-5 py-4' key={`${index}-details`}>
                    <h3 className='text-lg font-semibold text-gray-500'>Flight Stops</h3>
                    <div>
                        {flight.legs[0].segments.map((segment, index) => {
                            const nextDeparture = index + 1 < flight.legs[0].segments.length ? flight.legs[0].segments[index + 1]?.departure : null;
                            return <FlightStopDetails key={index} segment={segment} nextDeparture={nextDeparture} />
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

function FlightStopDetails({ segment, nextDeparture }: FlightStopDetailsProps) {
    return (
        <div className='pl-[5rem] mt-5'>
            <p>
                <span className='pi pi-circle-fill'></span>
                <span className='ml-4 text-black font-medium'>{formatDateToTime(segment.departure)} • {segment.origin.name} {segment.origin.name != segment.origin.parent?.name ? `- ${segment.origin.parent?.name}` : ''}</span>
            </p>
            <p className='ml-7 text-gray-500 text-sm py-3'>Travel time: {formatMinutes(segment.durationInMinutes)}</p>
            <p>
                <span className='pi pi-map-marker'></span>
                <span className='ml-4 text-black font-medium'>{formatDateToTime(segment.arrival)} • {segment.destination.name} {segment.destination.name != segment.destination.parent?.name ? `- ${segment.destination.parent?.name}` : ''}</span>
            </p>
            <p className='mt-4 font-semibold text-gray-500 text-sm'>{segment.marketingCarrier.name}{segment.marketingCarrier.name != segment.operatingCarrier.name ? ` • ${segment.operatingCarrier.name}` : ' '} • {segment.flightNumber} • {segment.marketingCarrier.alternateId}</p>
            {nextDeparture && <div className='ml-5rem w-full py-3 mt-5 text-sm' style={{borderBottom: '1px solid #ccc', borderTop: '1px solid #ccc'}}>{timeDifference(segment.arrival, nextDeparture)} layover • {segment.destination.parent?.name}</div>}
        </div>
    )
}

export default FlightDetails;