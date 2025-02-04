"use client";

import type { SelectOption } from "../types/input";
import { BsArrowLeftRight, BsArrowRight } from "react-icons/bs";
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';

interface InputSelectProps {
    value: string;
    placeholder: string;
    onChange: (value: DropdownChangeEvent) => void;
}

const options: SelectOption[] = [
    { value: '1', label: 'Round Trip' },
    { value: '2', label: 'One Way' },
];

// This component is used to select the flight type (Round Trip or One Way)
function FlightTypeInputSelect({value, placeholder, onChange }: InputSelectProps) {

    const valueTemplate = (option: SelectOption, props: any) => {
        if (option) {
            return (
                <div className="flex align-items-center">
                    {option.value === '2' ? <BsArrowRight className="mt-2 text-sm" /> : <BsArrowLeftRight className="mt-2 text-sm" />}
                    <div className="flex-auto ml-3 mt-1 text-sm">{option.label}</div>
                </div>
            );
        }

        return (
            <div className="flex align-items-center">
                <BsArrowLeftRight className="mt-2 text-sm" />
                <div className="flex-auto ml-3 mt-1 text-sm">{props.placeholder}</div>
            </div>
        );
    };

    return (
        <Dropdown 
            value={value} 
            onChange={onChange} 
            options={options} 
            optionLabel="label" 
            placeholder={placeholder} 
            className="text-sm-dropdown" 
            valueTemplate={valueTemplate}
            checkmark={true}
            highlightOnSelect={true} 
        />
    );
}

export default FlightTypeInputSelect;