

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


export const txToKeeper = (tx) => {
    switch (tx.type) {
        case 6:
            return convertBurnTxToKeeper(tx);
        default:
            throw new Error('Need realization');
    }
};