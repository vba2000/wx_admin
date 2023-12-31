const node = 'https://nodes.waves.exchange/';
const factory = '3PCuHsTU58WKhCqotbcSwABvdPzqqVAbbTv';

const assetsStore = {'WAVES': {ticker: 'WAVES', decimals: 8}};
const getDataState = async (address) => {
    const url = `${node}addresses/data/${address}`;
    const data = await fetch(url).then(res => res.json());
    return data;
};

const getAssets = async (ids) => {
    const idsToFetch = ids.filter((id) => !assetsStore[id]);
    while (true) {
        const ids = idsToFetch.splice(0, 100);
        if (ids.length) {
            const fetchedAssets = await fetch(`${node}assets/details`, {
                body: JSON.stringify({ids}),
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            }).then(res => res.json());

            fetchedAssets.forEach((asset) => {
                assetsStore[asset.assetId] = asset;
            });

            if (idsToFetch.length === 0) {
                break;
            }
        } else {
            break;
        }
    }

    return ids.map((id) => assetsStore[id]);
};

const getTransactionStatus = async (txId) => {
    return fetch(`${node}transactions/status/${txId}`).then(res => res.json())
        .then(data => {
            if (data.status !== 'confirmed') {
                throw new Error('Not in chain');
            }
        });
};

const createPoll = (func, times = 10, delta = 1000) => {
    let time = 0;
    let result;
    let stop = false;
    let hasDataCbOk;
    let hasDataCbError;
    const promise = new Promise((res, rej) => {
        hasDataCbOk = res;
        hasDataCbError = rej
    });

    async function tryExec() {
        if (time > times) return null;
        time++;

        try {
            result = await func();
            hasDataCbOk(result);
        } catch (e) {
            time >= times || stop ? hasDataCbError(e) : setTimeout(tryExec, delta);
        }
    }

    tryExec();
    return {resultPromise: promise, stop: () => stop = true};
};

export const broadcastAndWaitTxs = (txs, progress = (p) => p) => {
    txs = Array.isArray(txs) ? txs : [txs];
    progress(0);
    return txs.reduce((acc, tx, currentIndex) => {
        const sendTx = () => broadcast(tx);
        return acc.then(async () => {
            const {resultPromise: txOnNode} = createPoll(sendTx);
            const tx = await txOnNode;
            progress((currentIndex + 0.5) / txs.length * 100);
            const {resultPromise} = createPoll(() => getTransactionStatus(tx.id));
            await resultPromise;
            progress((currentIndex + 1) / txs.length * 100);
        });
    }, Promise.resolve());
};


export const broadcast = async (tx) => fetch(`${node}transactions/broadcast`, {
    body: tx,
    method: 'POST',
    headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
    }
}).then(res => res.json());

export const getPoolsData = async () => {
    const dataState = await getDataState(factory);
    const {poolsData, globalSettings} = parsePools(dataState);
    const assetsState = await getDataState(globalSettings.assetStore);
    const assetStore = parseAssetStore(assetsState);

    const missTickers = Object.entries(assetStore).reduce((acc, [id]) => {
        acc.push(id);
        return acc;
    }, []);

    const assets = await getAssets(missTickers);

    assets.forEach((asset) => {
        assetStore[asset.assetId] = assetStore[asset.assetId] || {};
        assetStore[asset.assetId].asset = asset;
        assetStore[asset.assetId].ticker = assetStore[asset.assetId].ticker || asset.name;
        assetStore[asset.assetId].id = asset.assetId;
    })

    return {poolsData, assetStore, globalSettings};
};

export const statusToText = (status) => {
    switch (status && status.toString()) {
        case '1':
            return 'Active';
        case '2':
            return 'Disable put tkn';
        case '3':
            return 'Disable put and bot';
        case '4':
            return 'Pool Disabled';
        default:
            return 'Unknown status';
    }
};
const parseAssetStore = (assetStore) => {
    const assetStoreData = {};
    assetStore.forEach(({key, value}) => {
        const splited = key.split('__');
        switch (true) {
            case key.includes('%s%s__assetDescription'):
                assetStoreData[splited[2]] = assetStoreData[splited[2]] || {};
                assetStoreData[splited[2]].description = value;
                break;
            case key.includes('%s%s__labels__'):
                assetStoreData[splited[2]] = assetStoreData[splited[2]] || {};
                assetStoreData[splited[2]].labels = value;
                break;
            case key.includes('%s%s__assetId2ticker__'):
                assetStoreData[splited[2]] = assetStoreData[splited[2]] || {};
                assetStoreData[splited[2]].ticker = value;
                break;
            case key.includes('logo_<'):
                const asset = /logo_<(.+)>/.exec(key)[1];
                assetStoreData[asset] = assetStoreData[asset] || {};
                assetStoreData[asset].logo = value;
                break;
            case key.includes('ticker_<'):
                const assetId = /ticker_<(.+)>/.exec(key)[1];
                assetStoreData[assetId] = assetStoreData[assetId] || {};
                assetStoreData[assetId].ticker = value;
                break;
            default:

        }

    });

    return assetStoreData;
}

const parsePools = (factoryDataState) => {
    const poolsConfig = {};
    const idToPool = {};
    const swapDisabled = {};
    const oneTokenDisabled = {};
    const globalSettings = {matcherSwapFee: 200000, poolSwapFee: 200000, swapFee: 400000, factoryContract: factory};
    const notUsed = [];
    const wxEmission = {};
    factoryDataState.forEach(dataStatePair => {
        const {key, value} = dataStatePair;
        switch (true) {
            case key.includes('__mappings__poolAssets2PoolContract'):
                const [, a2, p2] = key.split('__');
                idToPool[`${a2}__${p2}`] = value;
                break;
            case key.includes('__swapDisabled'):
                const [, a1, p1] = key.split('__');
                swapDisabled[`${a1}__${p1}`] = value;
                break;
            case key.includes('%s%s__spread__'):
                const [, , pool1] = key.split('__');
                poolsConfig[pool1] = poolsConfig[pool1] || {};
                poolsConfig[pool1] = {...poolsConfig[pool1], spread: value};
                break;
            case key.includes('%s%s__outFee__'):
                const [, , pool2] = key.split('__');
                poolsConfig[pool2] = poolsConfig[pool2] || {};
                poolsConfig[pool2] = {...poolsConfig[pool2], outFee: value};
                break;
            case key.includes('%s%s__inFee__'):
                const [, , pool3] = key.split('__');
                poolsConfig[pool3] = poolsConfig[pool3] || {};
                poolsConfig[pool3] = {...poolsConfig[pool3], inFee: value};
                break;
            case key.includes('%s%s__skipOrderValidation__'):
                const [, , pool5] = key.split('__');
                poolsConfig[pool5] = poolsConfig[pool5] || {};
                poolsConfig[pool5] = {...poolsConfig[pool5], skipValidation: value};
                break;
            case key.includes('%s%s__swapFee__'):
                const [, , pool4] = key.split('__');
                poolsConfig[pool4] = poolsConfig[pool4] || {};
                const [, swapFee1, swapFee2] = value.split('__');
                const poolSwapFee = parseInt(swapFee1, 10);
                const matcherSwapFee = parseInt(swapFee2, 10)
                const swapFee = poolSwapFee + matcherSwapFee;
                poolsConfig[pool4] = {...poolsConfig[pool4], matcherSwapFee, poolSwapFee, swapFee};
                break;
            case key.includes('__config'):
                const conf = parseConfig(value);
                poolsConfig[conf.address] = poolsConfig[conf.address] || {};
                poolsConfig[conf.address] = {...conf, ...poolsConfig[conf.address]};
                break;
            case key.includes('%s%s%s__wxEmission__'):
                const [, , assAm, assPr] = key.split('__');
                wxEmission[assAm + assPr] = value;
                break;
            case key === '%s__swapContract':
                globalSettings.swapContract = value;
                break;
            case key === '%s__assetsStoreContract':
                globalSettings.assetStore = value;
                break;
            case key === '%s__oneTokenOperationsDisabled':
                globalSettings.oneTokenDisable = value;
                break;
            case key.includes('__oneTokenOperationsDisabled'):
                const [, a3, p4] = key.split('__');
                oneTokenDisabled[`${a3}__${p4}`] = value;
                break;
            case key === '%s__swapFeeDefault':
                alert('Do not forget');
                break;
            case key === '%s__inFeeDefault':
                globalSettings.inFee = value;
                break;
            case key === '%s__outFeeDefault':
                globalSettings.outFee = value;
                break;
            case key === '%s__feeCollectorAddress':
                globalSettings.feeCollector = value;
                break;
            case key === '%s__managerVaultAddress':
                globalSettings.manager = value;
                break;
            case key.includes('mappings'):
                break;
            default:
                notUsed.push([key, value]);
        }
    });

    const poolsData = Object.entries(poolsConfig).reduce((acc, [, conf]) => {
        if (conf.address) {
            acc[conf.address] = conf;
            acc[conf.address].swapDisable = !!swapDisabled[conf.poolId];
            acc[conf.address].oneTokenDisable = !!oneTokenDisabled[conf.poolId];
            acc[conf.address].wxEmission = wxEmission[conf.amountAssetId + conf.priceAssetId];
        }
        return acc;
    }, {});

    return {poolsData, globalSettings};
}


const parseConfig = (data) => {
    const splitData = data.split('__');

    const address = splitData[1]
    const status = parseInt(splitData[2], 10);
    const LPAssetId = splitData[3];
    const amountAssetId = splitData[4];
    const priceAssetId = splitData[5];
    const amountAssetDcm = parseInt(splitData[6], 10);
    const priceAssetDcm = parseInt(splitData[7], 10);
    const IAmountAssetId = splitData[8];
    const IPriceAssetId = splitData[9];
    const LPAssetDcm = parseInt(splitData[10], 10);
    const type = splitData[11];
    const poolId = `${IAmountAssetId}__${IPriceAssetId}`;

    return {
        address,
        status,
        LPAssetId,
        amountAssetId,
        priceAssetId,
        amountAssetDcm,
        priceAssetDcm,
        IAmountAssetId,
        IPriceAssetId,
        LPAssetDcm,
        type,
        poolId,
    };
}

export const convertSvgString = (svgString) => {
    const base64Img = window.btoa(svgString);
    return base64Img;
}

export const createKeeperInvokeForKeeper = (dApp, func, args, payment) => {
    return {
        type: 16,
        data: {
            fee: {
                tokens: '0.05',
                assetId: 'WAVES',
            },
            dApp,
            call: {
                function: func,
                args: args || undefined,
            },
            payment: payment || []
        }
    };
};

export const setPoolStatusTx = (poolAddress, status) => {
    return createKeeperInvokeForKeeper(factory, 'managePool', [
        {type: 'string', value: poolAddress},
        {type: 'integer', value: status}
    ], []);
};
export const setPoolWxEmissionsTx = (amountAssetId, priceAssetId, hasWxEmission) => {
    return createKeeperInvokeForKeeper(factory,
        hasWxEmission ? 'setWxEmissionPoolLabel' : 'deleteWxEmissionPoolLabel', [
            {type: 'string', value: amountAssetId},
            {type: 'string', value: priceAssetId}
        ], []);
};


export const setFactoryDataTransaction = (pool, globalSettings, data) => {

    let {poolSwapFee, matcherSwapFee} = data || {};
    let swapFeeValue = undefined;
    if (poolSwapFee !== null && matcherSwapFee === null) {
        matcherSwapFee = globalSettings.matcherSwapFee;
    }
    if (poolSwapFee === null && matcherSwapFee !== null) {
        poolSwapFee = globalSettings.poolSwapFee;
    }
    if (poolSwapFee === null) {
        swapFeeValue = null;
    }
    if (poolSwapFee !== undefined && poolSwapFee !== null) {
        swapFeeValue = `%d%d__${poolSwapFee}__${matcherSwapFee}`;
    }

    const dataState = [
        {key: `%s%s__skipOrderValidation__${pool.address}`, type: 'boolean', value: data.skipValidation},
        {
            key: `%d%d%s__${pool.IAmountAssetId}__${pool.IPriceAssetId}__oneTokenOperationsDisabled`,
            type: 'boolean',
            value: data.oneTokenDisable
        },
        {
            key: `%d%d%s__${pool.IAmountAssetId}__${pool.IPriceAssetId}__swapDisabled`,
            type: 'boolean',
            value: data.swapDisable
        },
        {key: `%s%s__spread__${pool.address}`, type: 'integer', value: data.spread},
        {key: `%s%s__inFee__${pool.address}`, type: 'integer', value: data.inFee},
        {key: `%s%s__outFee__${pool.address}`, type: 'integer', value: data.outFee},
        {key: `%s%s__swapFee__${pool.address}`, type: swapFeeValue ? 'string' : null, value: swapFeeValue},
    ].filter((dataSet) => dataSet.value !== undefined);

    return dataState.length ? {
        type: 12,
        data: {
            sender: factory,
            senderPublicKey: 'HBWgh7DKPyzCnEXKJAJ5dKQ3jmPtMhGD78tt6jRdkV61',
            data: dataState,
            fee: {
                tokens: '0.01',
                assetId: 'WAVES',
            },
        },
    } : null;
};