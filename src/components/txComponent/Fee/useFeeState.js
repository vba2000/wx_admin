import {useCallback, useMemo, useState} from "react";
import {getMinFeeForDataTx} from "../../../services";


const FEES = {
    6:  (tx, minSponsoredAssetFee = 1) => {
            return 0.001 * 10 ** 8;
    },
    4:  (tx, minSponsoredAssetFee = 1) => {
        return 0.001 * 10 ** 8;
    },
    12: (tx, minSponsoredAssetFee = 1) => {
        return getMinFeeForDataTx(tx);
    }
};

const getFee = (tx, feeAsset) => {
    const isWaves = feeAsset && feeAsset.id === 'WAVES';
    if (!feeAsset || (!isWaves && !feeAsset.asset.minSponsoredAssetFee) || !FEES[tx.type]) {
        return null;
    }

   if (FEES[tx.type]) {
       const feeInWaves = FEES[tx.type](tx, feeAsset);
       if (isWaves) {
           return feeInWaves;
       }

       return Math.floor(feeAsset.asset.minSponsoredAssetFee * feeInWaves / 100000);
   }

    return null;

};

export const useFeeState = ({ tx, feeAsset, onChange  }) => {

    const [fee, setFee] = useState(tx.fee || 0);

    const resetFee = useCallback(() => setFee(null), []);

    return useMemo(() => {
        const state = {
            fee: fee === null ? getFee(tx, feeAsset) : fee,
            setFee,
            resetFee,
            feeAsset
        };

        onChange(state.fee);

        return state;
    }, [tx, feeAsset, fee, onChange, resetFee]);

}