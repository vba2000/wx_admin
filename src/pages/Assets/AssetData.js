import {useCallback, useMemo, useState} from "react";


export function assetData({signTransactionsPackage, diff, asset}) {

    const [isLoading, setIsLoading] = useState(false);

    const assetStoreDataState = useMemo(() => {
        return genDataStateToSave(diff, asset.asset.assetId) || null;
    }, [diff, asset.asset.assetId]);


    const sendTxs = useCallback(() => {
        setIsLoading(true);
        const txs = makeDataTx(assetStoreDataState)

        setIsLoading(false);
    }, [assetStoreDataState, signTransactionsPackage, asset])


    return {sendTxs, isLoading};
}

const genDataStateToSave = (diff, assetId) => {
    const dataState = [];
    if ('logo' in diff) {
        const logo = diff.logo ?
            atob(diff.logo.split('base64,')[1].trim()).replaceAll('\n', '')
                .replaceAll('\t', '').replace('<?', '<')
                .replace('?>', '>') : null;

        if (logo) {
            dataState.push({
                key: `logo_<${assetId}>`,
                value: logo,
                type: 'string'
            });
        } else {
            dataState.push({
                key: `logo_<${assetId}>`,
                value: null,
            });
        }
    }

    if ('ticker' in diff) {
        dataState.push({
            key: `%s%s__assetId2ticker__${assetId}`,
            value: diff.ticker || null,
            type: diff.ticker ? 'string' : null
        });
    }


    return dataState;
}


const makeDataTx = (assetStoreDataStated) => {

    const txAssetStore = {
        type: 12,
        data: {
            data: assetStoreDataStated,
            fee: {
                tokens: '0.01',
                assetId: 'WAVES',
            },
        },
    };

    const txMinAmount = null;

    return [txAssetStore, txMinAmount];
};