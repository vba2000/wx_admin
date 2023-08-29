import {useCallback, useContext, useState} from "react";
import {DataContext} from "../../../context/Data";
import {Col, Container, Form, FormGroup, Row} from "react-bootstrap";
import {InputWithDecimals} from "../../../components/InputWithDecimals";
import {OnOffSm} from "../../../components/OnOff";


export const GeneralSettingsForm = ({...props}) => {

    const {globalPoolsSettings} = useContext(DataContext);
    const {inFee, outFee, poolSwapFee, matcherSwapFee, spread, oneTokenDisable, shutdown} = globalPoolsSettings;

    const [poolsEnabled, setPoolsEnabled] = useState(!shutdown);
    const [oneTkn, setOneTkn] = useState(!oneTokenDisable);
    const [newSpread, setNewSpread] = useState(spread);
    const [feeInOneTkn, setFeeInOneTkn] = useState(inFee);
    const [feeOutOneTkn, setFeeOutOneTkn] = useState(outFee);
    const [newPoolSwapFee, setPoolSwapFee] = useState(poolSwapFee);
    const [newMatcherSwapFee, setMatcherSwapFee] = useState(matcherSwapFee);

    return <Container fluid>
        <Row>
            <Col md={2} xs={6}>
                <Form.Text muted>Pools Enable</Form.Text>
                <FormGroup>
                    <OnOffSm value={poolsEnabled} onChange={setPoolsEnabled}/>
                </FormGroup>
            </Col>
            <Col md={2} xs={6}>
                <Form.Text muted>One Token</Form.Text>
                <FormGroup>
                    <OnOffSm value={oneTkn} onChange={setOneTkn}/>
                </FormGroup>
            </Col>
            <Col lg={2} xs={6}>
                <Form.Text  muted>On Tkn In %</Form.Text>
                <FormGroup>
                    <InputWithDecimals hasDefault={true} value={feeInOneTkn} onChange={setFeeInOneTkn} decimals={6} placeholder={0}/>
                </FormGroup>
            </Col>
            <Col lg={2} xs={6}>
                <Form.Text muted>One Tkn Out %</Form.Text>
                <FormGroup>
                    <InputWithDecimals hasDefault={true} value={feeOutOneTkn} onChange={setFeeOutOneTkn} decimals={6} placeholder={0}/>
                </FormGroup>
            </Col>
            <Col lg={2} xs={6}>
                <Form.Text muted>Swap Pool Fee %</Form.Text>
                <FormGroup>
                    <InputWithDecimals hasDefault={true} value={newPoolSwapFee} onChange={setPoolSwapFee} decimals={6} placeholder={0}/>
                </FormGroup>
            </Col>
            <Col lg={2} xs={6}>
                <Form.Text muted>Swap Matcher fee %</Form.Text>
                <FormGroup>
                    <InputWithDecimals hasDefault={true} value={newMatcherSwapFee} onChange={setMatcherSwapFee} decimals={6} placeholder={0}/>
                </FormGroup>
            </Col>
            <Col lg={2} xs={6}>
                <Form.Text muted>Default Spread %</Form.Text>
                <FormGroup>
                    <InputWithDecimals
                        hasDefault={false}
                        value={newSpread}
                        onChange={setNewSpread}
                        decimals={6}
                        placeholder={'0'}
                    />
                </FormGroup>
            </Col>
        </Row>
    </Container>
};