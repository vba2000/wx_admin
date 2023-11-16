import {Button, Col, Container, Form, FormGroup, InputGroup, Row} from "react-bootstrap";
import React, {useCallback, useState} from "react";


export const DefaultMinAmount = ({poolAssetDefaultMinAmount, isAdmin, saveMinAmount, ...props}) => {

    const [minAmount, setMinAmount] = useState(poolAssetDefaultMinAmount);

    const setDefault = useCallback(() => setMinAmount(poolAssetDefaultMinAmount), [poolAssetDefaultMinAmount, setMinAmount])

    const onChange = useCallback((e) => {
        if (!isNaN(Number(e.target.value))) {
            setMinAmount(Number(e.target.value));
        } else {
            setMinAmount(Number(minAmount));
        }
    }, [setMinAmount, minAmount]);

    const onClick = useCallback(() => {
        saveMinAmount(Number(minAmount));
    }, [minAmount, saveMinAmount]);

    return <Col md={4} xs={6}>
        <Container>
            <Row>
                <FormGroup>
                    <InputGroup size={"sm"}>
                        <InputGroup.Text id="assetFind"><small>Min Amount</small></InputGroup.Text>
                        <Form.Control
                            size={"sm"}
                            value={minAmount}
                            placeholder="Asset name"
                            aria-label="Search"
                            aria-describedby="assetFind"
                            onChange={onChange}
                            disabled={!isAdmin}
                        />
                        <InputGroup.Text id="poolSearch" hidden={!isAdmin}>
                            <small className={"btn btn-sm p-0 m-0 px-1"} onClick={setDefault}>x</small>
                        </InputGroup.Text>
                        <Button size='sm' onClick={onClick}
                                hidden={!isAdmin} disabled={!isAdmin || Number(minAmount) === poolAssetDefaultMinAmount}>Save</Button>
                    </InputGroup>
                </FormGroup>
            </Row>
        </Container>
    </Col>;
}