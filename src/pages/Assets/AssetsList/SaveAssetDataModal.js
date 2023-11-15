import {Button, Col, Container, Modal, ProgressBar, Row, Spinner} from "react-bootstrap";
import {useCallback, useContext, useState} from "react";
import {UserContext} from "../../../context/WavesKeeper";
import {IconLogo} from "../../../components/SvgString";
import {
    broadcastAndWaitTxs,
    setAssetStorageDataTransaction,
    setFactoryAssetMinAmountDataTransaction
} from "../../../services";
import {DataContext} from "../../../context/Data";

export const SaveAssetDataModal = ({diff, asset, isShow, hideModal, ...params}) => {

    const [progress, setProgress] = useState(0);
    const {signTransactionsPackage, txLoading} = useContext(UserContext);
    const {globalPoolsSettings} = useContext(DataContext);

    const isLoading = txLoading || progress;

    const saveAssetData = useCallback(async () => {
        const toSave = {};
        setProgress(0);
        if ('logo' in diff) {
            toSave.logo = diff.logo;
        }

        if ('ticker' in diff) {
            toSave.ticker = diff.ticker;
        }

        if ('assetsMinAmount' in diff) {
            toSave.minAmount = diff.assetsMinAmount;
        }

        if ('externalTicker' in diff) {
            toSave.externalTicker = diff.externalTicker;
        }

        try {
            const txs = [
                setAssetStorageDataTransaction(toSave, globalPoolsSettings, asset.id),
                setFactoryAssetMinAmountDataTransaction(toSave, globalPoolsSettings, asset.id)
            ].filter(Boolean);

            const signedTx = await signTransactionsPackage(txs);
            const res = await broadcastAndWaitTxs(signedTx, setProgress);

            if ('logo' in diff) {
                asset.logo = diff.logo;
            }

            if ('ticker' in diff) {
                asset.ticker = diff.ticker;
            }

            if ('minAmount' in diff) {
                asset.minAmount = diff.assetsMinAmount;
            }

            if ('externalTicker' in diff) {
                asset.externalTicker = diff.externalTicker;
            }
            setProgress(0);
            hideModal();
            return res;
        } catch (e) {
            const error = await e;
            setProgress(0);
            return error;
        }
    }, [diff, globalPoolsSettings, asset, hideModal, signTransactionsPackage]);

    if (!isShow) {
        return;
    }

    return <Modal show={isShow}
                  backdrop="static"
                  keyboard={false}
                  size="lg"
                  aria-labelledby="contained-modal-title-vcenter"
                  centered>
        <Modal.Header>
            <Modal.Title>Save settings for <h6>{asset.ticker || asset.assetName || asset.asset.name}</h6></Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Container>
                <Row>
                    <Col md={2}>
                        <IconLogo svgString={diff.logo} width={32}/>
                    </Col>
                    <Col style={{height: '64px', overflow: 'scroll', width: '100%'}}>
                        {diff.logo}
                    </Col>
                </Row>
                <Row>
                    <Col md={2}><small>Ticker</small></Col>
                    <Col md={1}>{diff.ticker === undefined ? 'No' : diff.ticker}</Col>
                    <Col md={2}><small>External ticker</small></Col>
                    <Col md={1}>{diff.externalTicker === undefined ? 'No' : diff.externalTicker}</Col>
                    <Col md={2}><small>Min amount</small></Col>
                    <Col md={4}>{diff.assetsMinAmount === undefined ? 'No' : diff.assetsMinAmount}</Col>
                </Row>
            </Container>
        </Modal.Body>
        <Modal.Footer>
            <Container>
                <Row hidden={!isLoading}>
                    <Col md={2}> <Spinner/></Col>
                    <Col>
                        <ProgressBar variant={"info"} striped now={progress}/>
                    </Col>
                </Row>
                <Row>
                    <Col md={3}></Col>
                    <Col md={3}>
                        <Button variant="primary" onClick={hideModal} className={"mx-1"} hidden={isLoading}>
                            Close
                        </Button>
                    </Col>
                    <Col md={3}>
                        <Button variant="" onClick={saveAssetData} hidden={isLoading}>Save</Button>
                    </Col>
                    <Col md={3}></Col>
                </Row>
            </Container>
        </Modal.Footer>
    </Modal>;
};