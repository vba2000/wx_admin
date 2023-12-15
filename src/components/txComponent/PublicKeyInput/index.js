import {useCallback, useEffect, useState} from "react";
import {InputGroup, Form, Button, FormText} from "react-bootstrap";
import {checkPublicKey} from "../../../services";


export const PublicKeyInput = ({ value, defaultValue, onChange, ...props }) => {

    const [pk, setPk] = useState(value);
    const [hasError, setError] = useState(false);

    const onSetPk = useCallback((event) => {
        const pk = event.target.value;
        const isValid = checkPublicKey(pk);
        setPk(pk);
        onChange(isValid ? pk : '');
        setError(!isValid);
    }, [value, onChange]);

    useEffect(() => {
        if (pk !== value ) {
            setPk(value);
            setError(!(!value || checkPublicKey(value)));
        }
    }, [value, setPk]);

    useEffect(() => {
        if (!value && defaultValue) {
            onSetPk({ target: { value: defaultValue } });
        }
    }, [defaultValue]);


    const setDefault = useCallback(() => {
        onSetPk({ target: { value: defaultValue } });
    }, [defaultValue])

    return <InputGroup {...props}>
        <FormText as={Button} onClick={setDefault} style={{ width: '160px' }} id="basic-addon1" variant="secondary">Sender Public key</FormText>
        <Form.Control
            placeholder="base58 public key"
            aria-label="base58 public key"
            aria-describedby="basic-addon1"
            value={pk}
            onChange={onSetPk}
        />
        <InputGroup.Text className={hasError ? 'bg-danger' : 'bg-success'}>{hasError ? 'Enter valid Pk' : 'Valid'}</InputGroup.Text>
    </InputGroup>
};