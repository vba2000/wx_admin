import {Alert, Row, Col, Button} from "react-bootstrap";
import {useContext, useEffect} from "react";
import {DataContext} from "../../context/Data";


export const GeneralSettings = (params) => {

    const { fetchData, globalPoolsSettings, isLoadingData, hasError, hasData } = useContext(DataContext);
    const {assetStore, inFee, outFee, oneTokenDisable, feeCollector, manager} = globalPoolsSettings;

    if (isLoadingData || hasError || !hasData) {
        return null;
    }

    return <Alert variant="light" className="m-2">
        <Alert.Heading >
            <Row>
                <Col className="border-bottom"><h4>Global settings</h4></Col>
                <Col className="col-lg-2 text-right border-bottom"><Button className="float-end" variant="link"
                                                                           size="sm" onClick={fetchData}>Update
                    data</Button></Col>
            </Row>
        </Alert.Heading>
        <Row className="">
            <Col>
                Asset Store: <small className="text-muted">{assetStore}</small>
            </Col>
            <Col>Fee collector: <small className="text-muted">{feeCollector}</small></Col>
            <Col>Manager Contract: <small className="text-muted">{manager}</small></Col>
        </Row>
        <Row className="">
            <Col>Fee In: <small className="text-muted">{inFee / 10 ** 6}%</small></Col>
            <Col>Fee out: <small className="text-muted">{outFee / 10 ** 6}% </small></Col>
            <Col>Disable one token: <small className="text-muted">{oneTokenDisable.toString()}</small></Col>
        </Row>
    </Alert>;
}