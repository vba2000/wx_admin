import {Col, Row, Form} from "react-bootstrap";
import {useCallback, useMemo, useState} from "react";


export const StatsItem = ({ data, assets, setSelected, hideLowLiq, showBotStopped, showBotRunning, globalSettings, ...props }) => {

    const { assetsMinAmount, poolAssetDefaultMinAmount } = globalSettings;

    const {
        address,
        pool_status,
        amount_asset_id,
        price_asset_id,
        // pool_lp_asset_id,
        rate_lp_usd,
       // current_price,
        amount_asset_balance,
        price_asset_balance,
        pool_lp_balance,
       // base_apys = [],
       // reward_apy_max,
       // baseApy,
        maxApy
    } = data;


    const amountAsset = assets[amount_asset_id];
    const priceAsset = assets[price_asset_id];
    const amountName = amountAsset.ticker || amountAsset.asset.name;
    const priceName = priceAsset.ticker || priceAsset.asset.name;
    //const lpAsset = assets[pool_lp_asset_id];
    const link = `https://wx.network/liquiditypools/pools/${amountName}_${priceName}`;
    const liqudity = (Number(pool_lp_balance) * Number(rate_lp_usd)).toFixed(2);
    data.link = link;
    data.poolName = `${amountName}/${priceName}`;
    data.liquidiy = liqudity;

    const [selected, selectItem] = useState(false);

    const isStopped = useMemo(() => {
        if (pool_status > 2) {
            return true;
        }
        const amountDecimals = amountAsset.asset.decimals;
        const priceDecimals = priceAsset.asset.decimals;
        const amountMinAmount = (assetsMinAmount[amount_asset_id] ? assetsMinAmount[amount_asset_id] : poolAssetDefaultMinAmount) / 10 ** amountDecimals;
        const priceMinAmount = (assetsMinAmount[price_asset_id] ? assetsMinAmount[price_asset_id] : poolAssetDefaultMinAmount) / 10 ** priceDecimals ;
        return !(amountMinAmount <= Number(amount_asset_balance) && priceMinAmount <= Number(price_asset_balance));
    }, [pool_status, amountAsset, priceAsset, assetsMinAmount, poolAssetDefaultMinAmount,
        amount_asset_balance, amount_asset_id, price_asset_balance, price_asset_id]);

    const onSelect = useCallback(() => {
        data.selected = !data.selected;
        selectItem(data.selected);
    }, [data])

    if (hideLowLiq && Number(liqudity) < 300) {
        return null;
    }

    if (showBotStopped && !isStopped) {
        return null;
    }

    if (showBotRunning && isStopped) {
        return null;
    }

    return <Row onClick={onSelect} className={selected ? 'bg-secondary-subtle' : ''}>
        <Col md={2}><small>{amountAsset.ticker || amountAsset.asset.name}/{priceAsset.ticker || priceAsset.asset.name}</small></Col>
        <Col md={1}>${liqudity}</Col>
        <Col md={1}>{(maxApy || 0).toFixed(2)} %</Col>
        <Col md={3}><small>{address}</small></Col>
        <Col><small>{amount_asset_balance} {amountName}</small></Col>
        <Col><small>{price_asset_balance} {priceName}</small></Col>
        <Col>
            <Form.Check
                type="switch"
                id="select"
                label=""
                checked={selected}
            />
        </Col>
    </Row>;
}