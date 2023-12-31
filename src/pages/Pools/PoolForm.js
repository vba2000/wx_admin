import {Alert, Button, Col, Modal, Form, FormGroup, Row} from "react-bootstrap";
import {useCallback, useContext, useMemo, useState} from "react";
import {OnOffSm} from "../../components/OnOff";
import {InputWithDecimals} from "../../components/InputWithDecimals";
import {SavePoolDataModal} from "./SavePoolDataModal";
import {statusToText} from "../../services";
import {DataContext} from "../../context/Data";


const selectClassName = (status) => {
    switch (status) {
        case 1:
            return "text-bg-success";
        case 2:
            return "text-bg-warning";
        case 3:
            return "text-bg-danger";
        default:
            return "text-bg-secondary";
    }
}

export const PoolForm = ({pool, ...props}) => {

    const [status, setStatus] = useState(pool.status);
    const onStatusChange = useCallback((event) => {
        setStatus(parseInt(event.currentTarget.value, 10))
    }, []);

    const [oneTkn, setOneTkn] = useState(!pool.oneTokenDisable);
    const [swap, setSwap] = useState(!pool.swapDisable);
    const [wxEmission, setWxEmission] = useState(!!pool.wxEmission);
    const [skipOrderValidation, setSkipOrderValidation] = useState(!!pool.skipValidation);

    const [spread, setSpread] = useState(pool.spread);

    const [feeInOneTkn, setFeeInOneTkn] = useState(pool.inFee || null);
    const [feeOutOneTkn, setFeeOutOneTkn] = useState(pool.outFee || null);
    const [poolSwapFee, setPoolSwapFee] = useState(pool.poolSwapFee || null);
    const [matcherSwapFee, setMatcherSwapFee] = useState(pool.matcherSwapFee || null);

    const clearChangesCb = useCallback(() => {
        setStatus(pool.status);
        setOneTkn(!pool.oneTokenDisable);
        setSwap(!pool.swapDisable);
        setWxEmission(!!pool.wxEmission);
        setSkipOrderValidation(!!pool.skipValidation);
        setSpread(pool.spread);
        setFeeInOneTkn(pool.inFee || null);
        setFeeOutOneTkn(pool.outFee || null);
        setPoolSwapFee(pool.poolSwapFee || null);
        setMatcherSwapFee(pool.matcherSwapFee || null);
    }, [setStatus, setWxEmission, setSkipOrderValidation, setOneTkn, setSwap, setSpread, setFeeInOneTkn, setFeeOutOneTkn, setPoolSwapFee, setMatcherSwapFee, pool]);

    const diff = useMemo(() => {
        let diff = {};
        if (pool.status !== status) {
            diff.status = status;
        }
        if (pool.oneTokenDisable !== !oneTkn) {
            diff.oneTokenDisable = !oneTkn;
        }
        if (pool.swapDisable !== !swap) {
            diff.swapDisable = !swap;
        }
        if (pool.spread !== spread) {
            diff.spread = spread;
        }
        if ((pool.inFee || null) !== feeInOneTkn) {
            diff.inFee = feeInOneTkn;
        }
        if ((pool.outFee || null) !== feeOutOneTkn) {
            diff.outFee = feeOutOneTkn;
        }
        if ((pool.poolSwapFee || null) !== poolSwapFee || (pool.matcherSwapFee || null) !== matcherSwapFee) {
            diff.poolSwapFee = poolSwapFee;
            diff.matcherSwapFee = matcherSwapFee;
        }

        if ((!!pool.wxEmission) !== !!wxEmission) {
            diff.wxEmission = wxEmission;
        }
        if ((!!pool.skipValidation) !== !!skipOrderValidation) {
            diff.skipValidation = skipOrderValidation;
        }

        return !!Object.entries(diff).length ? diff : null;
    }, [pool, status, oneTkn, swap, spread, feeInOneTkn, feeOutOneTkn, poolSwapFee, matcherSwapFee, wxEmission, skipOrderValidation]);

    const [saveModalShow, setSaveModalShow] = useState(false);

    const showModal = useCallback(() => setSaveModalShow(true), []);
    const hideModal = useCallback(() => setSaveModalShow(false), []);

    return <Alert variant="light" className={`m-0 ${ diff ? 'border-danger' : ''}`}>
        <Row>
            <Col md={4} xs={6}>
                <FormGroup style={{minWidth: '180px', maxWidth: "200px"}}>
                    <Form.Text muted>Pool Status</Form.Text>
                    <Form.Select size="sm" value={status} onChange={onStatusChange}
                                 className={selectClassName(status)}>
                        <option className={selectClassName(1)} value={1}>{statusToText(1)}</option>
                        <option className={selectClassName(2)} value={2}>{statusToText(2)}</option>
                        <option className={selectClassName(3)} value={3}>{statusToText(3)}</option>
                        <option className={selectClassName(4)} value={4}>{statusToText(4)}</option>
                    </Form.Select>

                </FormGroup>
            </Col>
            <Col md={2} xs={6}>
                <Form.Text muted>Swap</Form.Text>
                <FormGroup>
                    <OnOffSm value={swap} onChange={setSwap}/>
                </FormGroup>
            </Col>
            <Col md={2} xs={6}>
                <Form.Text muted>One Token</Form.Text>
                <FormGroup>
                    <OnOffSm value={oneTkn} onChange={setOneTkn}/>
                </FormGroup>
            </Col>
            <Col md={2} xs={6}>
                <Form.Text muted>WX Emission</Form.Text>
                <FormGroup>
                    <OnOffSm value={wxEmission} onChange={setWxEmission}/>
                </FormGroup>
            </Col>
            <Col md={2} xs={6}>
                <Form.Text muted>Skip Order Validation</Form.Text>
                <FormGroup>
                    <OnOffSm value={skipOrderValidation} onChange={setSkipOrderValidation}/>
                </FormGroup>
            </Col>
        </Row>
        <hr/>
        <Row>
            <Col lg={2} xs={6}>
                <Form.Text muted>Spread %</Form.Text>
                <FormGroup>
                    <InputWithDecimals hasDefault={false} value={spread} onChange={setSpread} decimals={6} placeholder={0}/>
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
                    <InputWithDecimals hasDefault={true} value={poolSwapFee} onChange={setPoolSwapFee} decimals={6} placeholder={0}/>
                </FormGroup>
            </Col>
            <Col lg={2} xs={6}>
                <Form.Text muted>Swap Matcher fee %</Form.Text>
                <FormGroup>
                    <InputWithDecimals hasDefault={true} value={matcherSwapFee} onChange={setMatcherSwapFee} decimals={6} placeholder={0}/>
                </FormGroup></Col>
        </Row>
        <hr/>
        <Row>
            <Col className="text-end">
                <Button disabled={!diff} className={"w-50"} variant={"outline-success"} size={"sm"} onClick={showModal}>Save pool changes</Button>
            </Col>
            <Col>
                <Button className={"w-50"} variant={"outline-danger"} size={"sm"} onClick={clearChangesCb}>Clear changes</Button>
            </Col>
        </Row>
        <SavePoolDataModal pool={pool} data={diff} hideModal={hideModal} isShow={saveModalShow}/>
    </Alert>;
};