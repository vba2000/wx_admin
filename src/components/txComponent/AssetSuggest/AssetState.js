import {useCallback, useMemo, useState} from "react";
import {checkTransactionId, fetchAssets} from "../../../services";

const assetWeight = (asset, text) => {
    const { id, asset: fullAsset, ticker = '', assetName = '' } = asset;
    const { name } = fullAsset;

    const k = (ticker || assetName || name).length;

    if (!text) {
        return 0;
    }

    const lowerText = text.toLowerCase();

    if (id === text) {
        return 0;
    }

    if (ticker.toLowerCase() === lowerText) {
        return 0;
    }

    if (assetName.toLowerCase() === lowerText) {
        return 1;
    }

    if (name.toLowerCase() === lowerText) {
        return  2;
    }

    let acc = 0;

    acc += (ticker.toLowerCase().indexOf(lowerText) + 1) || 1000000000;
    acc += (assetName.toLowerCase().indexOf(lowerText) + 1) * 100 || 1000000000;
    acc += (name.toLowerCase().indexOf(lowerText) + 1) * 100000 || 1000000000;
    return acc * k;
}


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
        const input = (e.target.value.toString() || '');
        setIsLoading(true);
        const asset = await getAssetById(input, assets);
        if (asset) {
            assets[asset.id] = asset;
        }
        setIsLoading(false);
        setSuggest(input);
    }, [assets]);

    const filteredAsset = useMemo(() => {
        return Object.entries(assets).filter(([id, asset]) => {
            const text = suggest.toLowerCase();
            const {ticker = '', assetName = ''} = asset;
            const name = asset.asset.name.toLowerCase();
            return ticker.toLowerCase().includes(text) || assetName.toLowerCase().includes(text) || name.includes(text) || id === suggest;
        }).sort(([, assetA], [, assetB]) => assetWeight(assetA, suggest) - assetWeight(assetB, suggest));
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