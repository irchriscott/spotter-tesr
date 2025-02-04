import React, { useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { BsPerson } from "react-icons/bs";
import { OverlayPanel } from 'primereact/overlaypanel';
import type { PeopleCount } from '@/types/people';


function PeopleCountSelect({onDone}: {onDone: (people: PeopleCount) => void}) {

    const op = useRef<OverlayPanel>(null);

    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(0);
    const [infantsInSeat, setInfantsInSeat] = useState(0);
    const [infantsOnLap, setInfantsOnLap] = useState(0);

    const [totalPeople, setTotalPeople] = useState<PeopleCount>({
        adults: 1,
        children: 0,
        infants: 0
    });

    const [people, setPeople] = useState(1)

    const onDoneClick = (e: any) => {
        const people = {
            adults,
            children,
            infants: infantsInSeat + infantsOnLap
        };

        setTotalPeople(people);
        onDone(people);

        setPeople(adults + children + infantsInSeat + infantsOnLap);
        
        if (op.current) {
            op.current.toggle(e);
        }

        console.log(totalPeople);
    }

    return (
        <div>
            <Button text className='p-3' onClick={(e) => op.current && op.current.toggle(e)}>
                <div className="flex align-items-center">
                    <BsPerson className="mt-1"/>
                    <div className="flex-auto ml-4">{people}</div>
                    <div className="flex-auto ml-4">
                        <span className="pi pi-chevron-down mt-1" style={{color: "#71717a"}}></span>
                    </div>
                </div>
            </Button>
            <OverlayPanel ref={op}>
                <div>
                    <div className='flex align-items-center'>
                        <p className='mt-2 w-[140px]'>Adults</p>
                        <div className='flex align-items-center'>
                            <Button disabled={adults == 0} icon="pi pi-minus" severity="secondary" aria-label="Minus" className='w-[36px] h-[36px] bg-[#E7F0FE] text-sm' onClick={() => setAdults(adults - 1)}></Button>
                            <div className='mx-3 mt-2 w-[16px] text-center'>{adults}</div>
                            <Button disabled={adults >= 9} icon="pi pi-plus" severity="secondary" aria-label="Plus" className='w-[36px] h-[36px] bg-[#E7F0FE] text-sm' onClick={() => setAdults(adults + 1)}></Button>
                        </div>
                    </div>
                    <div className='flex align-items-center mt-5'>
                        <div className='w-[140px]'>
                            <p>Children</p>
                            <p className='text-xs font-semibold'>Aged 2-11</p>
                        </div>
                        <div className='flex align-items-center'>
                            <Button disabled={children == 0} icon="pi pi-minus" severity="secondary" aria-label="Minus" className='w-[36px] h-[36px] bg-[#E7F0FE] text-sm' onClick={() => setChildren(children - 1)}></Button>
                            <div className='mx-3 mt-2 w-[16px] text-center'>{children}</div>
                            <Button disabled={children >= 9} icon="pi pi-plus" severity="secondary" aria-label="Plus" className='w-[36px] h-[36px] bg-[#E7F0FE] text-sm' onClick={() => setChildren(children + 1)}></Button>
                        </div>
                    </div>
                    <div className='flex align-items-center mt-5'>
                        <div className='w-[140px]'>
                            <p>Infants</p>
                            <p className='text-xs font-semibold'>In seat</p>
                        </div>
                        <div className='flex align-items-center'>
                            <Button disabled={infantsInSeat == 0} icon="pi pi-minus" severity="secondary" aria-label="Minus" className='w-[36px] h-[36px] bg-[#E7F0FE] text-sm' onClick={() => setInfantsInSeat(infantsInSeat - 1)}></Button>
                            <div className='mx-3 mt-2 w-[16px] text-center'>{infantsInSeat}</div>
                            <Button disabled={infantsInSeat >= 9} icon="pi pi-plus" severity="secondary" aria-label="Plus" className='w-[36px] h-[36px] bg-[#E7F0FE] text-sm' onClick={() => setInfantsInSeat(infantsInSeat + 1)}></Button>
                        </div>
                    </div>
                    <div className='flex align-items-center mt-5'>
                        <div className='w-[140px]'>
                            <p>Infants</p>
                            <p className='text-xs font-semibold'>On lap</p>
                        </div>
                        <div className='flex align-items-center'>
                            <Button disabled={infantsOnLap == 0} icon="pi pi-minus" severity="secondary" aria-label="Minus" className='w-[36px] h-[36px] bg-[#E7F0FE] text-sm' onClick={() => setInfantsOnLap(infantsOnLap - 1)}></Button>
                            <div className='mx-3 mt-2 w-[16px] text-center'>{infantsOnLap}</div>
                            <Button disabled={infantsOnLap >= 9} icon="pi pi-plus" severity="secondary" aria-label="Plus" className='w-[36px] h-[36px] bg-[#E7F0FE] text-sm' onClick={() => setInfantsOnLap(infantsOnLap + 1)}></Button>
                        </div>
                    </div>
                    <div className="flex flex-wrap justify-content-center gap-3 mt-5">
                        <Button label="Done" text className='px-3 py-2 text-blue-600' onClick={onDoneClick} />
                        <Button label="Cancel" text className='px-3 py-2 text-red-600' onClick={(e) => op.current && op.current.toggle(e)}/>
                    </div>
                </div>
            </OverlayPanel>
        </div>
    );
}

export default PeopleCountSelect;