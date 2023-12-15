import {Col, Container, Row, Spinner} from "react-bootstrap";
import React, {useContext} from "react";
import {DataContext} from "../../../context/Data";
import {UserContext} from "../../../context/WavesKeeper";
import {useTxData} from "../TxData";
import {PublicKeyInput} from "../../../components/txComponent/PublicKeyInput";
import {TimestampInput} from "../../../components/txComponent/TimestampInput";
import {AssetSuggest} from "../../../components/txComponent/AssetSuggest";
import {AddressInput} from "../../../components/txComponent/AddressInput";
import {FeeAmount} from "../../../components/txComponent/Fee";
import {AmountInput} from "../../../components/txComponent/AmountInput";
import {CustomInput} from "../../../components/txComponent/CustomInput";
import {SubmitTx} from "../../../components/txComponent/Submit";
import {Attachment} from "../../../components/txComponent/Attachment";


const Transfer = ({ ...props }) => {
    const { userData, signTransactionsPackage } = useContext(UserContext);
    const { isLoadingData, assets } = useContext(DataContext);
    const { actions, txData, tx, isSending, error } = useTxData(
        {
            type: 4,
            version: 2,
            feeAsset: assets['WAVES']
        },
        assets,
        signTransactionsPackage
    );

    if (isSending) {
        return  <Container hidden={isLoadingData} className={'bg-body-secondary p-2 m-4'}>
            <Row className={'m-1'}><Col className={'bg-success border rounded m-2 p-2'}>Transfer (tx type 4)</Col></Row>
            <Row className={'m-1'}>
                <Col className={'bg-info border rounded m-2 p-2'}>
                    <Spinner/>
                </Col>
            </Row>
        </Container>
    }

    return <Container hidden={isLoadingData} className={'bg-body-secondary p-2 m-4'}>
        <Row className={'m-1'}><Col className={'bg-info border rounded m-2 p-2'}>Transfer (tx type 4)</Col></Row>
        <Row className={'m-1'}><Col><PublicKeyInput onChange={actions.setSenderPublicKey} value={tx.senderPublicKey} defaultValue={userData.publicKey}/></Col></Row>
        <Row className={'m-1'}><Col><AddressInput fieldName={'Sender'} disabled={true} value={tx.sender}/></Col></Row>
        <Row className={'m-1'}><Col><AddressInput fieldName={'Recipient'} value={tx.recipient} onChange={actions.setRecipient}/></Col></Row>
        <Row className={'m-1'}><Col><TimestampInput onChange={actions.setTimestamp} value={tx.timestamp}/></Col></Row>
        <Row className={'m-1'}><Col><AssetSuggest fieldName="Transfer" assets={assets} selectAsset={actions.setTxAsset} asset={txData.txAsset}/></Col></Row>
        <Row className={'m-1'}><Col><AmountInput fieldName={'Transfer Amount'} value={txData.txAmount} asset={txData.txAsset} address={txData.sender} onChange={actions.setTxAmount}/></Col></Row>
        <Row className={'m-1'}><Col><AssetSuggest fieldName="Fee" assets={assets} selectAsset={actions.setTxFeeAsset} asset={txData.txFeeAsset}/></Col></Row>
        <Row className={'m-1'}><Col><FeeAmount tx={tx} feeAsset={txData.txFeeAsset} onChange={actions.setTxFee}/></Col></Row>
        <Row className={'m-1'}><Col><Attachment value={txData.txAttachment} onChange={actions.setTxAttachment}/></Col></Row>
        <Row className={'m-1'}><Col><CustomInput fieldName={'Tx Id'} value={tx.id} hidden={!tx.id}/></Col></Row>
        <SubmitTx tx={tx} hidden={!tx.id} onSubmitTx={actions.onSubmitTx}/>
        {error ? <Row className={'m-1 text-danger'}><Col>{error.message}/></Col></Row> : null}
    </Container>;
};

export default Transfer;