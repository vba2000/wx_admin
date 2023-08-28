import {Accordion, Col, Row} from "react-bootstrap";
import {IconLogo} from "../../components/SvgString";
import {useContext} from "react";
import {DataContext} from "../../context/Data";


const boolToString = (isActive) => isActive ? <small className="text-bg-success rounded px-2">Enable</small> :
    <small className="text-bg-danger rounded px-2">Disable</small>;
const poolStatus = (address, status, poolName) => {

    const statusStr = status === 1 ? 'Active' : status === 2 ? 'Disabled put tokens' : status === 3 ? 'Disabled put tokens and bot trade' : 'Disabled pool';
    const textColorClass = status === 1 ? 'text-bg-success' : status === 2 ? 'text-bg-warning' : status === 3 ? 'text-bg-danger' : 'text-bg-secondary';

    return <Col style={{minWidth: "350px"}} className="text-center">
        <Row><small className="text-muted">{address}</small></Row>
        <Col><small className={textColorClass + ' rounded px-2'}>{poolName}: {statusStr}</small></Col>
    </Col>;
};

export const PoolHeader = ({poolData, ...props}) => {

    const { globalPoolsSettings, assets } = useContext(DataContext);

    const {
        amountAssetId,
        poolId,
        priceAssetId,
        address,
        swapDisable,
        oneTokenDisable,
        LPAssetId,
        status,
        inFee,
        outFee,
        swapFee,
        spread,
        wxEmission,
        skipValidation
    } = poolData;
    const {logo = ""} = assets[LPAssetId] || {};
    const swap = !swapDisable;
    const oneTkn = !oneTokenDisable;
    const poolSwapFeeFull = swapFee || globalPoolsSettings.swapFee;
    const amountName = assets[amountAssetId].ticker;
    const priceName = assets[priceAssetId].ticker;
    const poolName = `${amountName || 'no name'}/${priceName || 'no'}`


    return <Accordion.Header>
        <Row>
            <Col className="align-middle rounded bg-light"><IconLogo width={32} height={32} svgString={logo}/></Col>
            {poolStatus(address, status, poolName)}
            <Col>
                <Row><small className="lab}el label-primary text-nowrap">Swap</small></Row>
                <Row><small className="text-muted">{boolToString(swap)}</small></Row>
            </Col>
            <Col>
                <Row><small className="label label-primary text-nowrap">One tkn</small></Row>
                <Row><small className="text-muted">{boolToString(oneTkn)}</small></Row>
            </Col>
            <Col>
                <Row><small className="label label-primary text-nowrap">Wx Emiss</small></Row>
                <Row><small className="text-muted">{boolToString(wxEmission)}</small></Row>
            </Col>
            <Col>
                <Row><small className="label label-primary text-nowrap">Skip Validate</small></Row>
                <Row><small className="text-muted">{boolToString(skipValidation)}</small></Row>
            </Col>
            <Col>
                <Row><small className="label label-primary text-nowrap">Fee In</small></Row>
                <Row><small className="text-muted">{(inFee || globalPoolsSettings.inFee) / 10 ** 6}%</small></Row>
            </Col>
            <Col>
                <Row><small className="label label-primary text-nowrap">Fee Out</small></Row>
                <Row><small className="text-muted">{(outFee || globalPoolsSettings.outFee) / 10 ** 6}%</small></Row>
            </Col>
            <Col>
                <Row><small className="label label-primary text-nowrap">Fee Swap</small></Row>
                <Row><small className="text-muted">{poolSwapFeeFull / 10 ** 6}%</small></Row>
            </Col>
            <Col>
                <Row><small className="label label-primary text-nowrap">Spread</small></Row>
                <Row><small className="text-muted">{spread / 10 ** 6}%</small></Row>
            </Col>
            <Col>
                <Row><small className="label label-primary text-nowrap">Internal Id</small></Row>
                <Row><small className="text-muted">{poolId}</small></Row>
            </Col>
        </Row>


    </Accordion.Header>
}