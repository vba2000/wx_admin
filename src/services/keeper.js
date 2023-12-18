

export const convertBurnTxToKeeper = (tx) => {
    return {
        type: 6,
        data: {
            ...tx,
            amount: tx.amount,
            assetId: tx.assetId,
            fee: {
                coins: tx.fee,
                assetId: tx.feeAssetId || 'WAVES',
            },
        },
    };
};

export const convertTransferToKeeper = (tx) => {
    return {
        type: 4,
        data: {
            ...tx,
            amount: tx.amount,
            assetId: tx.assetId,
            fee: {
                coins: tx.fee,
                assetId: tx.feeAssetId || 'WAVES',
            },
        },
    };
};

export const convertDataToKeeper = (tx) => {
    return {
        type: 12,
        data: {
            ...tx,
            amount: tx.amount,
            assetId: tx.assetId,
            fee: {
                coins: tx.fee,
                assetId: tx.feeAssetId || 'WAVES',
            },
        },
    };
};


export const txToKeeper = (tx) => {
    switch (tx.type) {
        case 6:
            return convertBurnTxToKeeper(tx);
        case 4:
            return convertTransferToKeeper(tx);
        case 12:
            return convertDataToKeeper(tx);
        default:
            throw new Error('Need realization');
    }
};