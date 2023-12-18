import {useCallback, useEffect, useState} from "react";
import {checkAddress} from "../../../services";
import {Button, Form, InputGroup} from "react-bootstrap";

export const AddressInput = ({ fieldName, value, onChange, disabled, ...props }) => {

    const [address, setAddress] = useState(value);
    const [hasError, setError] = useState(false);

    const onSetAddress = useCallback((event) => {
        const address = event.target.value;
        const isValid = !checkAddress(address);
        onChange(isValid ? address : '');
        setError(!isValid);
    }, [onChange]);

    useEffect(() => {
        if (address !== value ) {
            const isValid = !checkAddress(value);
            setError(!(!value || isValid));
        }
    }, [value, setAddress]);

    return <InputGroup {...props}>
        <Button  variant="secondary" style={{ width: '160px' }}  disabled={true}>{fieldName} Address</Button>
        <Form.Control
            placeholder="base58 address"
            aria-label="base58 address"
            aria-describedby="basic-addon1"
            value={value}
            onChange={onSetAddress}
            disabled={disabled}
        />
        <InputGroup.Text className={hasError ? 'bg-danger' : 'bg-success'}>{hasError ? 'Enter valid address' : 'Valid'}</InputGroup.Text>
    </InputGroup>
};