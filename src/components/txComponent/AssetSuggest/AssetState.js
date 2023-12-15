import {useCallback, useMemo, useState} from "react";
import {checkTransactionId, fetchAssets} from "../../../services";


const getAssetById = async (assetId = '', assets) => {
    const item = assets[assetId || 'WAVES'];

    if (item) {
        return item;
    }

    const isValid = checkTransactionId(assetId);

    if (!isValid) {
        return;
    }

    try {
        const asset = await fetchAssets(assetId);
        return {
            id: assetId,
            ticker: '',
            asset
        };
    } catch (e) {
        return;
    }
}

export const AssetState = (assets) => {

    const [suggest, setSuggest] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const clearSuggest = useCallback(() => {
        setSuggest('');
    }, []);

    const onSuggest = useCallback(async (e) => {
        const input = (e.target.value.toString() || '').toLowerCase();
        setIsLoading(true);
        const asset = await getAssetById(e.target.value.toString() || '', assets);
        if (asset) {
            assets[asset.id] = asset;
        }
        setIsLoading(false);
        setSuggest(input);
    }, [assets]);

    const filteredAsset = useMemo(() => {
        return Object.entries(assets).filter(([id, asset]) => {
            const assetId = id.toLowerCase();
            const {ticker = '', assetName = ''} = asset;
            const name = asset.asset.name.toLowerCase();
            return ticker.toLowerCase().includes(suggest) || assetName.toLowerCase().includes(suggest) || name.includes(suggest) || assetId.includes(suggest);
        });
    }, [assets, suggest]);

    const state = useMemo(() => {
        return {
            clearSuggest,
            isLoading,
            filteredAsset,
            onSuggest,
            suggest
        };
    }, [assets, onSuggest, suggest, isLoading, filteredAsset]);

    return state;
};