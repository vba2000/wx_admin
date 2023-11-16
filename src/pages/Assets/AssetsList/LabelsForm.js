import {Badge,  Col, Row} from "react-bootstrap";
import React, {useCallback, useEffect, useMemo, useState} from "react";


const LabelToEdit = ({ label, onDelete, toDelete, ...props }) => {
    const onClick = useCallback(() => {
        onDelete(label);
    }, [label, onDelete]);

    return <Badge className={'mx-1 my-1'} bg={toDelete ? 'danger' : 'primary'} onClick={onClick} style={{cursor: 'pointer'}}>{label}</Badge>
}

const LabelToAdd = ({ label, onAdd, toAdd, ...props }) => {
    const onClick = useCallback(() => {
        onAdd(label);
    }, [label, onAdd]);

    return <Badge className={'mx-1 my-1'} bg={toAdd ? 'success' : 'secondary'} onClick={onClick} style={{cursor: 'pointer'}}>{label}</Badge>
}

export const LabelsForm = ({ labels, onChange, allLabels, ...props }) => {
    const [labelsToShow, setLabelsToShow] = useState((labels || '').split('__'));
    const [toDelete, setToDelete] = useState({});
    const [toAdd, setToAdd] = useState({});

    const onDeleteLabel = useCallback((label) => {
        if (toDelete[label]) {
            delete toDelete[label];
            setToDelete({ ...toDelete });
        } else {
            setToDelete({ ...toDelete, [label]: true });
        }
    }, [toDelete, setToDelete]);

    const onAddLabel = useCallback((label) => {
        if (toAdd[label]) {
            delete toAdd[label];
            setToAdd({ ...toAdd });
        } else {
            setToAdd({ ...toAdd, [label]: true });
        }
    }, [toAdd, setToAdd]);

    const availableLabelsToAdd = useMemo(() => {
        return allLabels.reduce((acc, label) => {
            if (!labelsToShow.includes(label)) {
                acc.push(label);
            }
            return acc;
        }, []);
    }, [labelsToShow, allLabels]);


    useEffect(() => {
        setLabelsToShow((labels || '').split('__'));
    }, [labels]);

    useEffect(() => {
        const res = [ ...labelsToShow, ...Object.keys(toAdd) ].filter(l => !toDelete[l]).join('__');
        onChange(res);
    }, [toAdd, toDelete, labelsToShow, onChange]);

    return <Row>
        <Col md={2}>Labels</Col>
        <Col>
            <h6>
            {
                labelsToShow.map(label => <LabelToEdit  label={label} toDelete={toDelete[label]} onDelete={onDeleteLabel}/>)
            }
            {
                availableLabelsToAdd.map(label => <LabelToAdd  label={label} toAdd={toAdd[label]} onAdd={onAddLabel}/>)
            }
            </h6>
        </Col>
    </Row>;
}