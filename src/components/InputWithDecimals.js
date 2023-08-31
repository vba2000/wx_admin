import { Form }  from 'react-bootstrap';
import {useCallback, useEffect, useMemo, useState} from "react";

export const InputWithDecimals = ({ hasDefault = true, value, onChange, decimals = 1, placeholder = '', ...props }) => {

    const [currentValue, setCurrentValue] = useState(!hasDefault ? value / 10 ** decimals || 0 : value !== null ? value / 10 ** decimals : '');

    const onChangeValue = useCallback((event) => {
        if(event.target.value === '') {
            onChange(hasDefault ? null : 0);
            setCurrentValue('');
        } else if (!isNaN(Number(event.target.value))) {
            setCurrentValue(event.target.value);

            const rawNum = (Number(event.target.value) * 10 ** decimals) << 0;
            if (value !== rawNum) {
                onChange(rawNum);
            }
        }
    }, [decimals, value, onChange, setCurrentValue, hasDefault]);

    const currentPlaceHolder = useMemo(() => {
        if (value === null && hasDefault) {
            return `Default`;
        } else {
            return placeholder || '';
        }
    }, [value, placeholder, hasDefault]);

    useEffect(() => {
        let current = hasDefault ? null : 0;
        if(currentValue === '') {
            current = hasDefault ? null : 0;
        } else if (!isNaN(Number(currentValue))) {
            current = (Number(currentValue) * 10 ** decimals) << 0;
        }

        if (current !== value) {
            setCurrentValue(!hasDefault ? value / 10 ** decimals || 0 : value !== null ? value / 10 ** decimals : '');
        }

    }, [value, hasDefault, decimals, setCurrentValue, currentValue]);

    return <Form.Control size="sm" type="text" placeholder={currentPlaceHolder} value={currentValue} onChange={onChangeValue}/>
}