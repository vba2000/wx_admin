import {Col, Row, Form, InputGroup, Container, Button} from "react-bootstrap";
import {useCallback, useEffect, useMemo, useState} from "react";
import {libs} from '@waves/waves-transactions';
import {isBase64} from "../../../../services";


const TypeItem = ({value, onChange, ...props}) => {

    const onSelect = useCallback((e) => {
        const type = e.target.value;
        if (type === 'delete') {
            onChange({type: null});
        } else {
            onChange({type});
        }
    }, [onChange]);

    return <InputGroup>
        <InputGroup.Text>Type</InputGroup.Text>
        <Form.Select aria-label="Select entries type" onChange={onSelect} value={value ? value : 'delete'}>
            <option value="string">String</option>
            <option value="integer">Integer</option>
            <option value="boolean">Boolean</option>
            <option value="binary">Bin (base64)</option>
            <option value="delete">Delete</option>
        </Form.Select>
    </InputGroup>

};

const KeyItem = ({value, onChange, doubleKeys, ...props}) => {

    const length = useMemo(() => libs.crypto.stringToBytes(value), [value]).length;
    const isValid = length > 0 && length < 400 && !doubleKeys[value];

    const onChangeKey = useCallback((e) => {
        onChange({key: e.target.value});
    }, [onChange]);

    useEffect(() => {
            onChange({keyIsValid: isValid});
    }, [isValid]);

    return <InputGroup>
        <InputGroup.Text>Key</InputGroup.Text>
        <Form.Control className={`${isValid ? 'border-success' : 'border-danger'}`} placeholder="Key (400b max)"
                      value={value} onChange={onChangeKey}/>
    </InputGroup>
};

const ValueItem = ({value, type, onChange, ...props}) => {

    const isValid = useMemo(() => {
        try {
            switch (type) {
                case 'string':
                    return libs.crypto.stringToBytes(value).length < 32500;
                case 'boolean':
                    return ['true', 'false'].includes(value.trim());
                case 'binary':
                    return isBase64(value, 32500);
                case null:
                    return value.length === 0;
                case 'integer':
                    return isFinite(Number(value));
            }
        } catch (e) {
            return false;
        }
    }, [type, value]);


    useEffect(() => {
        onChange({valueIsValid: isValid});
    }, [isValid]);

    const onChangeValue = useCallback((e) => {
        onChange({value: e.target.value});
    }, [onChange, value]);

    const placeholder = useMemo(() => {
        if (type === 'binary') {
            return "base64:(base64 value 32,767b max)"
        }

        if (type === 'boolean') {
            return 'true/false';
        }

        if (type === null) {
            return 'Empty';
        }

        if (type === 'integer') {
            return 'Integer number';
        }

        return 'String 32,767b max';
    }, [type]);

    return <InputGroup>
        <InputGroup.Text>Value</InputGroup.Text>
        <Form.Control className={isValid ? 'border-success' : 'border-danger'} placeholder={placeholder}
                      value={value} onChange={onChangeValue}/>
    </InputGroup>
};

export const EntriesForm = ({data, onChange, onDelete, doubleKeys, ...props}) => {

    const {key, type, value} = data;

    const onChangeEntries = useCallback((e) => {
        onChange(data, e);
    }, [data, onChange]);

    const deleteItem = useCallback(() => {
        onDelete(data);
    }, [data, onDelete]);

    return <Container className={'mb-1'}>
        <Row>
            <Col>
                <TypeItem value={type} onChange={onChangeEntries}/>
            </Col>
            <Col>
                <KeyItem value={key} doubleKeys={doubleKeys} onChange={onChangeEntries}/>
            </Col>
            <Col>
                <ValueItem type={type} onChange={onChangeEntries} value={value}/>
            </Col>
            <Col md={1}>
                <Button variant={'danger'} size={'sm'} onClick={deleteItem}>Del</Button>
            </Col>
        </Row>
        <Row>

        </Row>
    </Container>
};