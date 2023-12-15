import {useCallback, useMemo, useState} from "react";
import {broadcastAndWaitTxs, pubKeyToAddress} from "../../../services";
import * as wt from '@waves/waves-transactions';
import {txToKeeper} from "../../../services/keeper";


export const useTxData = (data = {}, assets, signTransactionsPackage) => {

    const [timestamp, setTimestamp] = useState(Date.now());
    const [senderPublicKey, setSenderPublicKey] = useState('');
    const [sender, setSender] = useState('');
    const [txFee, setTxFee] = useState(data.fee || 0);
    const [txFeeAsset, setTxFeeAsset] = useState(data.feeAsset);
    const [txAmountAsset, setTxAmountAsset] = useState(null);
    const [txAsset, setTxAsset] = useState(null);
    const [txAmount, setTxAmount] = useState(null);
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
            txAsset,
            txAmountAsset,
            txFeeAsset,
            txFee,
            sender,
            senderPublicKey,
            txAmount,
            timestamp
        };
    }, [data, txFee, txFeeAsset, sender, senderPublicKey, timestamp, txAsset, txAmountAsset, txAmount]);

    const txToSign = useMemo(() => {
        try {
            const {burn} = wt;
            const txForSign = burn({
                senderPublicKey,
                sender,
                assetId: txAsset ? txAsset.id : null,
                fee: txFee,
                feeAssetId: txFeeAsset ? txFeeAsset.id : null,
                amount: txAmount,
                ...data,
            });
            return txForSign;
        } catch (e) {

        }
        return null;
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
    }, [txToSign]);

    return {
        tx: txToSign || {
            senderPublicKey,
            sender,
            timestamp,
            amountAssetId: txAmountAsset ? txAmountAsset.id : null,
            assetId: txAsset ? txAsset.id : null,
            fee: txFee,
            feeAssetId: txFeeAsset ? txFeeAsset.id : null,
            amount: txAmount,
            ...data,
        },
        txToSign,
        actions: {
            onSubmitTx,
            setTimestamp,
            setSenderPublicKey: setSenderPK,
            setTxAsset,
            setTxFee,
            setTxFeeAsset,
            setTxAmountAsset,
            setTxAmount
        },
        txData,
        isSending,
        error
    };
};