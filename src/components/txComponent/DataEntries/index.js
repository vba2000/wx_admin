import {Button, Col, Container, Row} from "react-bootstrap";
import {useCallback, useMemo, useState} from "react";
import {EntriesForm} from "./EntriesForm";



export const DataEntries = ({value = [], onChange, withKeyName = true, ...props}) => {

    const [newEntries, setNewEntries] = useState(value);

    const addNew = useCallback(() => {
        setNewEntries([{ type: 'string', value: '', key: 'new', keyIsValid: true, valueIsValid: true }, ...newEntries]);
    }, [newEntries]);

    const onChangeEntries = useCallback((data, item) => {
        const newValue = newEntries.map(i => {
            if(i !== data) {
                return i;
            }
            return { ...i, ...item };
        });
        setNewEntries(newValue);
        onChange(newValue);
    }, [newEntries, onChange]);

    const onDeleteItem = useCallback((item) => {
        const deleted = newEntries.filter(i => i !== item);
        setNewEntries(deleted);
        onChange(deleted);
    }, [newEntries]);

    const doubleKeys = useMemo(() => {
        return newEntries.reduce((acc, item) => {
            if (acc.keys[item.key]) {
                acc.double[item.key] = true;
            }
            acc.keys[item.key] = true;

            return acc;
        }, { keys: {}, double: {} }).double;
    }, [newEntries]);


    return <Container className={'bg-light p-2 mb-1'}  {...props}>
        <Row className={'py-2 m-1'}>
            <Col>Data entries</Col>
            <Col md={2} className={'d-flex justify-content-end'}>
                <Button onClick={addNew} size={'sm'}>New</Button>
            </Col>
        </Row>
        {
         newEntries.map((item, i) => <EntriesForm key={i} data={item} doubleKeys={doubleKeys} onChange={onChangeEntries} onDelete={onDeleteItem}/>)
        }
    </Container>
};