import {Col, Container, Row} from "react-bootstrap";
import {useContext, useEffect, useMemo} from "react";
import {DataContext} from "../../../context/Data";
import {UserContext} from "../../../context/WavesKeeper";
import {useTxData} from "../TxData";


const Burn = ({ ...props }) => {
    const { userData } = useContext(UserContext);
    const { isLoadingData } = useContext(DataContext);

    const { setTxData, txData, tx } = useTxData();

    useEffect(() => {
        setTxData({
            senderPublicKey: userData.publicKey,
            type: 6,
            version: 2,
            fee: 100000,
            feeAssetId: 'WAVES',
            amount: 0,
            assetId: '',
            ...txData });
    }, [userData.publicKey, setTxData]);




    return <Container hidden={isLoadingData}>
        <Row><Col>Burn (tx type)</Col><Col>{tx.type}</Col></Row>
        <Row><Col>Version</Col><Col>{tx.version}</Col></Row>
        <Row><Col>Sender Pub Key</Col><Col>{tx.senderPublicKey}</Col></Row>
        <Row><Col>Sender</Col><Col>{tx.sender}</Col></Row>
        <Row><Col>Amount</Col><Col>{tx.amount}</Col></Row>
        <Row><Col>Amount Asset</Col><Col>{tx.assetId}</Col></Row>
        <Row><Col>Timestamp</Col><Col>{tx.timestamp}</Col></Row>
        <Row><Col>Fee</Col><Col>{tx.fee}</Col></Row>
        <Row><Col>Fee Asset</Col><Col>{tx.feeAssetId}</Col></Row>
    </Container>;
};

export default Burn;