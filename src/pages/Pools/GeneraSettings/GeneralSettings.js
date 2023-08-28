import {Alert, Row, Col, Button, Container, Form, FormGroup, Accordion} from "react-bootstrap";
import {useContext} from "react";
import {DataContext} from "../../../context/Data";
import {BoolStatCom} from "../../../components/BoolStatCom";
import {StringStatCom} from "../../../components/StringStatCom";


export const GeneralSettings = (params) => {

    const {fetchData, globalPoolsSettings, isLoadingData, hasError, hasData} = useContext(DataContext);
    const {inFee, outFee, swapFee, spread} = globalPoolsSettings;

    if (isLoadingData || hasError || !hasData) {
        return null;
    }

    return <Accordion className={"m-2"}>
        <Accordion.Item eventKey="main_settings" className="m-0">
            <Accordion.Header>
                <Row className="w-100">
                    <Col xxl={2} md={3} sm={4}>
                        <h1>Settings</h1>
                    </Col>
                    <BoolStatCom xxl={1} md={2} sm={3} value={true} valueName="Disable pools"
                                 title="Stop all pools operation"/>
                    <BoolStatCom xxl={1} md={2} sm={3} value={false} valueName="Stop one tkn"
                                 title="Stop in and out in one token operation for all pools"/>
                    <StringStatCom xxl={1} md={2} sm={3} value={`${inFee / 10 ** 6}%`} valueName="Default Fee In"/>
                    <StringStatCom xxl={1} md={2} sm={3} value={`${outFee / 10 ** 6}%`} valueName="Default Fee Out"/>
                    <StringStatCom xxl={1} md={2} sm={3} value={`${swapFee / 10 ** 6}%`} valueName="Default Swap fee"/>
                    <StringStatCom xxl={1} md={2} sm={3} value={`${spread / 10 ** 6}%`} valueName="Default Spread"/>
                    <Col xxl={1} md={1} sm={1} className={""}>
                        <Button className="bi bi-arrow-clockwise " variant="outline-warning" size="sm"
                                onClick={fetchData}
                                title={"Update data"}/>
                    </Col>
                </Row>
            </Accordion.Header>
            <Accordion.Body>
                full data
            </Accordion.Body>
        </Accordion.Item>
    </Accordion>
    // <Row>
    //     <Col sm={4} lg={4} md={4} className="border-bottom"><h4>Global settings</h4></Col>
    //     <Col sm={8} lg={8} md={8} className="col-lg-2 text-right border-bottom text-nowrap">
    //         <Row className="float-end">
    //             <Col>
    //                 <h6 muted>Disable pools</h6>
    //                 <FormGroup>
    //                     <OnOffSm value={true} title={"Stop all pools operation"} onChange={() => {
    //                     }}/>
    //                 </FormGroup>
    //             </Col>
    //             <Col>
    //                 <h6 muted>Stop one tkn</h6>
    //                 <FormGroup>
    //                     <OnOffSm value={true} title={"Stop in and out in one token operation for all pools"}
    //                              onChange={() => {
    //                              }}/>
    //                 </FormGroup>
    //             </Col>
    //             <Col>
    //                 <h6 muted>Update data</h6>
    //                 <FormGroup>
    //                     <Button className="bi bi-arrow-clockwise" variant="outline-warning" size="sm"
    //                             onClick={fetchData}
    //                             title={"Update data"}/>
    //                 </FormGroup>
    //             </Col>
    //         </Row>
    //     </Col>
    // </Row>
    // <Row className="">
    //     <Col>Fee In: <small className="text-muted">{inFee / 10 ** 6}%</small></Col>
    //     <Col>Fee out: <small className="text-muted">{outFee / 10 ** 6}% </small></Col>
    //     <Col>Disable one token: <small className="text-muted">{(oneTokenDisable || false).toString()}</small></Col>
    // </Row>;
}