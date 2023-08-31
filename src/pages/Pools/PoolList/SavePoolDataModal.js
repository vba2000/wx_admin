import {Alert, Button, Col, Modal, ProgressBar, Row} from "react-bootstrap";
import {useCallback, useContext, useMemo, useState} from "react";
import {UserContext} from "../../../context/WavesKeeper";
import {
    broadcastAndWaitTxs,
    setFactoryDataTransaction,
    setPoolStatusTx,
    setPoolWxEmissionsTx,
    statusToText
} from "../../../services";
import {DataContext} from "../../../context/Data";


const DiffView = ({label, value, realValue, ...props}) => {
    const hasRealValue = useMemo(() => realValue !== undefined, [realValue]);
    const [showRealValue, setShowRealValue] = useState(hasRealValue ? true : false);
    const toggleShowRealValue = useCallback(() => setShowRealValue(hasRealValue ? !showRealValue : false), [hasRealValue, showRealValue]);

    if (value === undefined) {
        return null;
    }

    return <Col className={"border border-1 my-1 mx-1 rounded text-bg-light"}
                style={{cursor: hasRealValue ? 'pointer' : ''}} onClick={toggleShowRealValue}>
        <Row className={"text-nowrap border-bottom"}><small>{label}</small></Row>
        <Row className={"text-nowrap"}><small
            className="text-nowrap text-muted">{showRealValue ? realValue.toString() : value.toString()}</small></Row>
    </Col>
}

const numberOrDefault = (value, decimals) => value === undefined ? undefined : value !== null ? value / 10 ** decimals : 'Default'
const ShowDiff = ({data}) => {

    const {
        status,
        oneTokenDisable,
        swapDisable,
        spread,
        inFee,
        outFee,
        poolSwapFee,
        matcherSwapFee,
        wxEmission,
        skipValidation
    } = data || {};

    return <Row className={"mb-2"}>
        <h5>Fields to save</h5>
        <DiffView value={status} realValue={statusToText(status)} label="Status"/>
        <DiffView value={oneTokenDisable} realValue={oneTokenDisable ? 'Disabled' : 'Enabled'}
                  label="One Token Operation"/>
        <DiffView value={swapDisable} realValue={swapDisable ? 'Disabled' : 'Enabled'} label="Swap Operation"/>
        <DiffView value={wxEmission} realValue={!wxEmission ? 'Disabled' : 'Enabled'} label="Wx emission"/>
        <DiffView value={skipValidation} realValue={!skipValidation ? 'Disabled' : 'Enabled'}
                  label="Skip order validation"/>
        <DiffView value={numberOrDefault(spread, 0)} realValue={numberOrDefault(spread, 6)} label="Bot spred %"/>
        <DiffView value={numberOrDefault(inFee, 0)} realValue={numberOrDefault(inFee, 6)}
                  label="Put pool one tkn fee %"/>
        <DiffView value={numberOrDefault(outFee, 0)} realValue={numberOrDefault(outFee, 6)}
                  label="Get pool one tkn fee %"/>
        <DiffView value={numberOrDefault(poolSwapFee, 0)} realValue={numberOrDefault(poolSwapFee, 6)}
                  label="Swap fee to pool %"/>
        <DiffView value={numberOrDefault(matcherSwapFee, 0)} realValue={numberOrDefault(matcherSwapFee, 6)}
                  label="Swap fee to matcher %"/>
    </Row>
};

export const SavePoolDataModal = ({pool, isShow, hideModal, data, ...params}) => {

    const { globalPoolsSettings, updatePool } = useContext(DataContext);

    const {signTransactionsPackage, txLoading, isLogin} = useContext(UserContext);
    const btnIsDisable = useMemo(() => !isLogin, [isLogin]);
    const [progress, setProgress] = useState(null);
    const [sendError, setSendError] = useState(null);

    const sendTx = useCallback(() => {
        setSendError('');

        const txs = [];
        if (data.status !== undefined) {
            txs.push(setPoolStatusTx(pool.address, data.status));
        }
        if (data.wxEmission !== undefined) {
            txs.push(setPoolWxEmissionsTx(pool.amountAssetId, pool.priceAssetId, data.wxEmission));
        }
        const dataTransaction = setFactoryDataTransaction(pool, globalPoolsSettings, data);
        if (dataTransaction) {
            txs.push(dataTransaction);
        }
        signTransactionsPackage(txs)
            .then(signedTxs => {
                setProgress(0);
                return broadcastAndWaitTxs(signedTxs, setProgress)
                    .then(() => {
                        setProgress(null);
                        updatePool({ ...data });
                        hideModal();
                    })
                    .catch(e => {
                        setProgress(null);
                        setSendError(e);
                    });
            });
    }, [data, pool, updatePool, setSendError, globalPoolsSettings, hideModal, signTransactionsPackage]);

    return <Modal show={isShow}
                  backdrop="static"
                  keyboard={false}
                  size="lg"
                  aria-labelledby="contained-modal-title-vcenter"
                  centered>
        <Modal.Header>
            <Modal.Title>Save settings for <h6>{pool.address}</h6></Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {!isLogin ? <Alert variant={"warning"}>Login by keeper!!!</Alert> : <ShowDiff data={data}/>}
            <Alert hidden={!sendError} variant={"danger"}>Send tx error. Try again!!!</Alert>
        </Modal.Body>
        <Modal.Footer>
            {progress !== null ? <Col><ProgressBar variant={"info"} striped now={progress}/> </Col>: <Col  className={"d-flex justify-content-center"}>
                <Button  variant="primary" onClick={hideModal} className={"mx-1"}>
                    Close
                </Button>
                <Button disabled={btnIsDisable || txLoading} variant="warning" onClick={sendTx}className={"mx-1"} >
                    Save Changes
                </Button>
            </Col>
            }
        </Modal.Footer>
    </Modal>
};