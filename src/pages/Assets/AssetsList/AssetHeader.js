import {Accordion, Col, Container, Row} from "react-bootstrap";
import {IconLogo} from "../../../components/SvgString";
import {useCallback, useContext, useMemo} from "react";
import {copyTextToClipboard} from "../../../services/Copy";
import {ToastContext} from "../../../components/Toasts";


export const AssetHeader = ({assetData, ...props}) => {

    const {
        logo,
        assetsMinAmount,
        labels,
        asset,
        ticker,
        assetName,
    } = assetData;

    const tokens = useMemo(() => {
        return assetsMinAmount / 10 ** asset.decimals;
    }, [assetsMinAmount, asset]);

    const {addNewMessage} = useContext(ToastContext);

    const onClick = useCallback((e) => {
        e.stopPropagation();
        e.preventDefault();
        copyTextToClipboard(asset.assetId);
        addNewMessage({text: `Asset id ${asset.assetId} was copied`, timeout: 1000, variant: 'light'})
    }, [asset, addNewMessage]);

    return <Accordion.Header title={asset.assetId} key={`header_${asset.assetId}`}>
        <Container>
            <Row>
                <Col className="align-middle my-2"><IconLogo width={32} height={32} svgString={logo} onClick={onClick}/></Col>
                <Col className="my-2">
                    <Row><small className="lab}el label-primary text-nowrap">Ticker</small></Row>
                    <Row><small className="text-muted">{ticker}</small></Row>
                </Col>
                <Col className="my-2">
                    <Row><small className="lab}el label-primary text-nowrap">Name</small></Row>
                    <Row><small className="text-muted">{assetName || asset.name}</small></Row>
                </Col>
                <Col className="my-2">
                    <Row><small className="lab}el label-primary text-nowrap">Min Amount</small></Row>
                    <Row><small className="text-muted">{tokens || 'N/A'}</small></Row>
                </Col>
                <Col className="my-2">
                    <Container style={{width: '150px'}}>
                        <Row><small className="lab}el label-primary text-nowrap">Labels</small></Row>
                        {
                            (labels || '').split('__').map((label) => <Row key={label}><small
                                className="text-muted">{label}</small></Row>)
                        }
                    </Container>
                </Col>
            </Row>
        </Container>.
    </Accordion.Header>
}