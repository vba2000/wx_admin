import {Col, Container, Form, FormGroup, InputGroup, Row} from "react-bootstrap";
import {OnOffSm} from "../../../components/OnOff";
import React, {useCallback, useEffect, useState} from "react";

export const FilterList = ({ list, setFilteredList, ...props }) => {

    const [ showDelisted, setShowDelisted ] = useState(false);
    const [ showHaveTicker, setShowHaveTicker ] = useState(false);
    const [ showWithMinAmount, setShowWithMinAmount] = useState(false);
    const [ byAsset, setByAsset ] = useState('');
    const clearSearch = useCallback(() => setByAsset(''), [setByAsset]);
    const setSearchFilter = useCallback((e) => {
        const search = e.target.value;
        setByAsset(search);
    }, [setByAsset]);

    useEffect(() => {
        const newList = list.filter(item => {
           if (showDelisted && !!item.labels) {
               return false;
           }

           if (showHaveTicker && !!item.ticker) {
               return false;
           }

           if (showWithMinAmount && !item.assetsMinAmount) {
               return false;
           }

           if (byAsset && (!item.ticker || (!item.ticker.toUpperCase().includes(byAsset.toUpperCase()) && !item.asset.assetId.toLowerCase().includes(byAsset.toLowerCase())))) {
               return false;
           }

           return true;
        });
        setFilteredList(newList);
    }, [list, showDelisted, showHaveTicker, showWithMinAmount, byAsset, setFilteredList]);


    return <Container>
        <Row>
            <Col sm={4} md={4} lg={3} xl={2} xxl={2} className="">
                <Form.Text muted >Search by asset</Form.Text>
                <FormGroup>
                <InputGroup size={"sm"}>
                    <InputGroup.Text id="assetFind"><small>Search</small></InputGroup.Text>
                    <Form.Control
                        size={"sm"}
                        value={byAsset}
                        placeholder="Asset name"
                        aria-label="Search"
                        aria-describedby="assetFind"
                        onChange={setSearchFilter}
                    />
                    <InputGroup.Text id="poolSearch"><small className={"btn btn-sm p-0 m-0 px-1"} onClick={clearSearch}>x</small></InputGroup.Text>
                </InputGroup>
                </FormGroup>
            </Col>
            <Col md={2} xs={6}>
                <Form.Text muted>Show delisted</Form.Text>
                <FormGroup>
                    <OnOffSm value={showDelisted} onChange={setShowDelisted}/>
                </FormGroup>
            </Col>
            <Col md={2} xs={6}>
                <Form.Text muted>Has Min amount</Form.Text>
                <FormGroup>
                    <OnOffSm value={showWithMinAmount} onChange={setShowWithMinAmount}/>
                </FormGroup>
            </Col>
            <Col md={2} xs={6}>
                <Form.Text muted>No icker</Form.Text>
                <FormGroup>
                    <OnOffSm value={showHaveTicker} onChange={setShowHaveTicker}/>
                </FormGroup>
            </Col>
            {props.children}
        </Row>
        <Row><hr/></Row>
    </Container>

};