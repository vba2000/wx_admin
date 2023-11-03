import {Button, Col, Container, Form, FormGroup, InputGroup, Row} from "react-bootstrap";
import React, {useCallback, useState} from "react";


export const DefaultMinAmount = ({poolAssetDefaultMinAmount, isAdmin, saveMinAmount, ...props}) => {

    const [minAmount, setMinAmount] = useState(poolAssetDefaultMinAmount);

    const setDefault = useCallback(() => setMinAmount(poolAssetDefaultMinAmount), [poolAssetDefaultMinAmount, setMinAmount])

    const onChange = useCallback((e) => {
        if(!isNaN(Number(e.target.value))) {
            setMinAmount(Number(e.target.value));
        } else {
            setMinAmount(Number(minAmount));
        }
    }, [setMinAmount, minAmount]);

    const onClick = useCallback(() => {
        saveMinAmount(Number(minAmount));
    }, [minAmount, saveMinAmount]);

    return <Col md={4} xs={6}>
        {
            !isAdmin ?
                <Container className="my-2">
                    <Row><small className="lab}el label-primary text-nowrap text-muted">Min Amount</small></Row>
                    <Row><small>{
                        poolAssetDefaultMinAmount || 'N/A'
                    }</small></Row>
                </Container> :
                <Container>
                    <Row><small className="lab}el label-primary text-nowrap text-muted">Min Amount</small></Row>
                    <Row>
                        <FormGroup>
                            <InputGroup size={"sm"}>
                                <Form.Control
                                    size={"sm"}
                                    value={minAmount}
                                    placeholder="Asset name"
                                    aria-label="Search"
                                    aria-describedby="assetFind"
                                    onChange={onChange}
                                />
                                <InputGroup.Text id="poolSearch"><small className={"btn btn-sm p-0 m-0 px-1"}
                                                                        onClick={setDefault}>x</small></InputGroup.Text>
                                <Button size='sm' onClick={onClick}
                                        hidden={Number(minAmount) === poolAssetDefaultMinAmount}>Save</Button>
                            </InputGroup>
                        </FormGroup>
                    </Row>
                </Container>
        }
    </Col>;
}