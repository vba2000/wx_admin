import {useCallback, useMemo, useState} from "react";
import {broadcastAndWaitTxs, pubKeyToAddress} from "../../../services";
import * as wt from '@waves/waves-transactions';
import {txToKeeper} from "../../../services/keeper";


export const useTxData = (data = {}, assets, signTransactionsPackage) => {

    const [timestamp, setTimestamp] = useState(Date.now());
    const [senderPublicKey, setSenderPublicKey] = useState('');
    const [sender, setSender] = useState('');
    const [recipient, setRecipient] = useState('');
    const [txFee, setTxFee] = useState(data.fee || 0);
    const [txFeeAsset, setTxFeeAsset] = useState(data.feeAsset);
    const [txAmountAsset, setTxAmountAsset] = useState(null);
    const [txAsset, setTxAsset] = useState(null);
    const [txAmount, setTxAmount] = useState(null);
    const [txAttachment, setTxAttachment] = useState('');
    const [isSending, setIsSending] = useState(null);
    const [error, setError] = useState(null);

    const setSenderPK = useCallback((pubKey) => {
        setSenderPublicKey(pubKey);
        if (pubKey) {
            try {
                const address = pubKeyToAddress(pubKey);
                setSender(address);
            } catch (e) {
                setSender('');
            }
        } else {
            setSender('');
        }
    }, []);

    const txData = useMemo(() => {
        return {
            ...data,
            recipient,
            txAsset,
            txAmountAsset,
            txFeeAsset,
            txFee,
            sender,
            senderPublicKey,
            txAmount,
            timestamp,
            txAttachment
        };
    }, [data, txFee, txFeeAsset, sender, senderPublicKey, timestamp, txAsset, txAmountAsset, txAmount, recipient, txAttachment]);

    const txToSign = useMemo(() => {
        const preparedTx = {
            senderPublicKey: txData.senderPublicKey,
            sender: txData.sender,
            recipient: txData.recipient,
            assetId: txData.txAsset ? txData.txAsset.id : null,
            fee: txData.txFee,
            feeAssetId: txData.txFeeAsset ? txData.txFeeAsset.id : null,
            amount: txData.txAmount,
            attachment: txData.txAttachment,
            ...data,
        };

        try {
            const { signTx } = wt;
            const txForSign = signTx(preparedTx);
            return txForSign;
        } catch (e) {
            console.log(e);
        }
        return preparedTx;
    }, [txData, data]);


    const onSubmitTx = useCallback(async () => {
        setIsSending(true);
        try {
            setError(null);
            const result = await signTransactionsPackage([txToKeeper(txToSign)]);
            await broadcastAndWaitTxs(result);
            setIsSending(false);

        } catch (e) {
            setError(e);
        }
        setIsSending(false);
    }, [txToSign, signTransactionsPackage]);

    const actions = useMemo(() => ({
        onSubmitTx,
        setTimestamp,
        setSenderPublicKey: setSenderPK,
        setTxAsset,
        setTxFee,
        setRecipient,
        setTxFeeAsset,
        setTxAmountAsset,
        setTxAmount,
        setTxAttachment,
    }), [onSubmitTx, setSenderPK]);

    return {
        tx: txToSign,
        actions,
        txData,
        isSending,
        error
    };
};