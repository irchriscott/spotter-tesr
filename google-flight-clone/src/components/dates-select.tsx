import { useState } from 'react';
import { Calendar } from 'primereact/calendar';

interface DateSelectProps {
    placeholder: string;
    onSelect: (date: Date) => void;
}

function DateSelect ({ placeholder, onSelect }: DateSelectProps) {

    const [date, setDate] = useState<Date | null>(null);

    const onSelectDate = (e: any) => {
        setDate(e.value);
        onSelect(e.value);
    }

    return (
        <div className='w-full'>
            <Calendar className='w-full' value={date} dateFormat='D, dd MM' placeholder={placeholder} minDate={new Date()} showIcon onChange={onSelectDate} />
        </div>
    );
}

export default DateSelect;