import { useState } from 'react';
import { Array } from "@dentistry/interfaces"

type props = {
    compare: Function
}

export function useArray<T>(props: props): Array<T> {
    //Creates Form states
    const [values, setValues] = useState<T[]>([])

    //Handles the Form change, changes the given form part value
    const findIndex = (value: T) => {
        const i = values.findIndex((e) => props.compare(value, e));
        return i;
    };

    const addValue = (value: T) => {
        let index = findIndex(value)
        if (index < 0) {
            let newValues = [...values, value]
            setValues([...newValues])
        }
    }
    const addValues = (value: T[]) => {
        setValues([])
        let newValues = [...values, ...value]
        setValues([...newValues])
    }

    const removeValue = (value: T) => {
        let index = findIndex(value)
        if (index > -1) {
            let newValues = [...values];
            newValues.splice(index, 1);
            setValues([...newValues])
        }
    }
    const clear = () => {
        setValues([])
    }

    return {
        values,
        addValue,
        addValues,
        removeValue,
        findIndex,
        clear
    };
}
