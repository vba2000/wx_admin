import {Accordion, Col, Container, Row} from "react-bootstrap";
import {IconLogo} from "../../../components/SvgString";
import {useCallback, useContext, useMemo, useState} from "react";
import {DataContext} from "../../../context/Data";
import {copyTextToClipboard} from "../../../services/Copy";
import {ToastContext} from "../../../components/Toasts";


export const AssetHeader = ({assetData, ...props}) => {

    const {
        logo,
        assetsMinAmount,
        labels,
        asset,
        ticker,
    } = assetData;

    const tokens = useMemo(() => {
        return assetsMinAmount / 10 ** asset.decimals;
    }, [assetsMinAmount, asset]);

    return <Accordion.Header>
        <Container>
            <Row>
                <Col className="align-middle my-2"><IconLogo width={32} height={32} svgString={logo}/></Col>
                <Col className="my-2">
                    <Row><small className="lab}el label-primary text-nowrap">Ticker</small></Row>
                    <Row><small className="text-muted">{
                        ticker
                    }</small></Row>
                </Col>
                <Col className="my-2">
                    <Row><small className="lab}el label-primary text-nowrap">Min Amount</small></Row>
                    <Row><small className="text-muted">{
                        tokens || 'N/A'
                    }</small></Row>
                </Col>
                <Col className="my-2">
                    <Container style={{width: '150px'}}>
                        <Row><small className="lab}el label-primary text-nowrap">Labels</small></Row>
                        {
                            (labels || '').split('__').map((label) => <Row><small
                                className="text-muted">{label}</small></Row>)
                        }
                    </Container>
                </Col>
            </Row>
        </Container>


    </Accordion.Header>
}