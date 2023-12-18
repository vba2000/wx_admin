import {useCallback, useMemo, useState} from "react";
import {broadcastAndWaitTxs, pubKeyToAddress} from "../../../services";
import * as wt from '@waves/waves-transactions';
import {txToKeeper} from "../../../services/keeper";


export const useTxData = (data = {}, assets, signTransactionsPackage) => {

    const [timestamp, setTimestamp] = useState(data.timestamp || Date.now());
    const [senderPublicKey, setSenderPublicKey] = useState('');
    const [sender, setSender] = useState(data.sender || '');
    const [recipient, setRecipient] = useState(data.recipient || '');
    const [txFee, setTxFee] = useState(data.fee || 0);
    const [txFeeAsset, setTxFeeAsset] = useState(data.feeAsset);
    const [txAmountAsset, setTxAmountAsset] = useState(null);
    const [txAsset, setTxAsset] = useState(null);
    const [txAmount, setTxAmount] = useState(data.amount || null);
    const [txAttachment, setTxAttachment] = useState(data.attachment || '');
    const [txDataEntries, setTxDataEntries] = useState(data.data || []);
    const [isSending, setIsSending] = useState(null);
    const [error, setError] = useState(null);

    const setSenderPK = useCallback((pubKey) => {
        setSenderPublicKey(pubKey);
        if (pubKey) {
            try {
                const sender = pubKeyToAddress(pubKey);
                setSender(sender);
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
            txAttachment,
            txDataEntries
        };
    }, [data, txFee, txFeeAsset, sender, senderPublicKey, timestamp, txAsset, txAmountAsset, txAmount, recipient, txAttachment, txDataEntries]);

    const txToSign = useMemo(() => {
        const preparedTx = {
            ...data,
            senderPublicKey: txData.senderPublicKey,
            sender: txData.sender,
            recipient: txData.recipient,
            assetId: txData.txAsset ? txData.txAsset.id : null,
            fee: txData.txFee,
            feeAssetId: txData.txFeeAsset ? txData.txFeeAsset.id : null,
            amount: txData.txAmount,
            attachment: txData.txAttachment,
            data: txData.txDataEntries,
        };

        if (txData.txDataEntries && txData.txDataEntries.some(i => !(i.keyIsValid && i.valueIsValid))){
            return preparedTx;
        } else if (txData.txDataEntries) {
            preparedTx.data = txData.txDataEntries.map(({ key, value, type }) => {
                switch (type) {
                    case 'integer':
                        value = Number(value);
                        break;
                    case 'boolean':
                        value = value === 'true' ? true : false;
                        break;
                    case null:
                        value = null;
                        break;
                    default:
                }
                return { key, type, value };
            });
        }

        try {
            const { signTx } = wt;
            return signTx(preparedTx);
        } catch (e) {
            console.log(e);
        }
        return preparedTx;
    }, [txData]);


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
        setTxDataEntries,
    }), [onSubmitTx, setSenderPK]);

    return {
        tx: txToSign,
        actions,
        txData,
        isSending,
        error
    };
};