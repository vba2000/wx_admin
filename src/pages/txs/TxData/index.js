import {useMemo, useState} from "react";
import {pubKeyToAddress} from "../../../services";


export const useTxData = (data = {}) => {

    const timestamp = useMemo(() => Date.now(), []);
    const [txData, setTxData] = useState({...data});

    const sender = useMemo(() => {
        if (txData.senderPublicKey) {
            return pubKeyToAddress(txData.senderPublicKey);
        }
        return '';
    }, [txData.senderPublicKey]);

    return useMemo(() => {
        return {
            tx: {
                timestamp,
                ...txData,
                sender,
            },
            txData,
            setTxData
        };
    }, [timestamp, txData, sender]);

};