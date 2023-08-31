import {createContext, useCallback, useMemo, useState} from 'react';
import {broadcast, getPoolsData, setMainnet, setTestnet} from "../services";



export const useDataForRoot = () => {

    const [pools, setPools] = useState({});
    const [globalPoolsSettings, setGlobalsPoolsSettings] = useState({});
    const [assets, setAssets] = useState({});
    const [isLoadingData, setLoadingData] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [hasData, setHasData] = useState(false);
    const [network, setNetwork] = useState('mainnet');

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
    }, [setPools, pools])

    const changeNetwork = useCallback((network) => {
        if (network === 'testnet') {
            setTestnet();
        } else {
            setMainnet();
        }
        setNetwork(network);
        setPools({});
        setHasData(false);
        setAssets({});
        setGlobalsPoolsSettings({});
        setHasError(false);
        setLoadingData(false);
    }, [setNetwork, setPools, setHasData, setAssets, setGlobalsPoolsSettings, setHasError, setLoadingData]);

    const api = useMemo(() => {
        return { fetchData, pools, globalPoolsSettings, assets, isLoadingData, hasError, broadcast, hasData, updatePool, network, changeNetwork };
    }, [pools, globalPoolsSettings, assets, isLoadingData, hasError, fetchData, hasData, updatePool, network, changeNetwork])
    return api;
};

export const DataContext = createContext(null);