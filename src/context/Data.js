import {createContext, useCallback, useMemo, useState} from 'react';
import {broadcast, getPoolsData} from "../services";



export const useDataForRoot = () => {

    const [pools, setPools] = useState({});
    const [globalPoolsSettings, setGlobalsPoolsSettings] = useState({});
    const [assets, setAssets] = useState({});
    const [isLoadingData, setLoadingData] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [hasData, setHasData] = useState(false);

    const fetchData = useCallback( () => {
        let stopFetched = false;
        setHasError(false);
        setLoadingData(true);
        const fetchData = async () => {
            try {
                const {globalSettings, poolsData, assetStore} = await getPoolsData();
                if (stopFetched) {
                    setLoadingData(false);
                    return null;
                }

                setPools(poolsData);
                setAssets(assetStore);
                setGlobalsPoolsSettings(globalSettings);
                setLoadingData(false);
                setHasData(true);
            } catch (e) {
                setLoadingData(false);
                if (stopFetched) {
                    return null;
                }
                setHasError(e);
            }
        };
        fetchData();
        return  () => stopFetched = true;
    }, [setPools, setGlobalsPoolsSettings, setAssets, setLoadingData, setHasError, setHasData]);

    const updatePool = useCallback((poolAddress, data) => {
        const newPools = { ...pools, [poolAddress]: { ...(pools[poolAddress] || {}), ...(data || {}) } }
        setPools(newPools);
    }, [setPools, hasData, pools])


    const api = useMemo(() => {
        return { fetchData, pools, globalPoolsSettings, assets, isLoadingData, hasError, broadcast, hasData, updatePool };
    }, [pools, globalPoolsSettings, assets, isLoadingData, hasError, fetchData, broadcast, hasData, updatePool])
    return api;
};

export const DataContext = createContext(null);