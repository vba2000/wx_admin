import {Col, Form, Row} from "react-bootstrap";
import React, {useCallback, useContext, useEffect, useMemo, useState} from "react";
import {DataContext} from "../../../context/Data";


export const PoolListFilters = ({setPoolList, ...props}) => {

    const {assets, hasData, pools} = useContext(DataContext);
    const [filters, setFilters] = useState({amountAsset: '*', priceAsset: '*'});
    const poolsList = useMemo(() => Object.entries(pools), [pools, hasData]);
    const {amountAssets, priceAssets} = useMemo(() => {
        const hasAmount = {};
        const hasPrice = {};

        poolsList.forEach(([id, {amountAssetId, priceAssetId}]) => {
            amountAssetId = amountAssetId || 'WAVES';
            priceAssetId = priceAssetId || 'WAVES';
            hasAmount[amountAssetId] = assets[amountAssetId];
            hasPrice[priceAssetId] = assets[priceAssetId];
        });

        const amountAssets = Object.values(hasAmount).filter(Boolean).sort(((a, b) => a.ticker > b.ticker ? 1 : a.ticker === b.ticker ? 0 : -1));
        const priceAssets = Object.values(hasPrice).filter(Boolean).sort(((a, b) => a.ticker > b.ticker ? 1 : a.ticker === b.ticker ? 0 : -1));
        return {amountAssets, priceAssets};
    }, [assets, poolsList]);


    const newPoolsList = useMemo(() => poolsList.filter(([, pool]) => {
        if (filters.amountAsset !== '*' && filters.amountAsset !== pool.amountAssetId) {
            return false;
        } else if (filters.priceAsset !== '*' && filters.priceAsset !== pool.priceAssetId) {
            return false;
        }

        return true;
    }), [poolsList, filters]);


    useEffect(() => {
        setPoolList(newPoolsList);
    }, [newPoolsList])

    const setAmountAssetFilter = useCallback((e) => {
        const amountAsset = e.target.value;
        const filter = {...filters, amountAsset};
        setFilters(filter);
    }, [filters]);

    const setPriceAssetFilter = useCallback((e) => {
        const priceAsset = e.target.value;
        const filter = {...filters, priceAsset};
        setFilters(filter);
    }, [filters]);

    if (!hasData) {
        return null;
    }


    return <Row className={'m-0 p-2 border border-bottom-0'}>
        <Col>
            <Form.Label htmlFor="amountAssetSelect"><small>Amount Asset</small></Form.Label>
            <Form.Select size="sm" id="amountAssetSelect" aria-describedby="amount asset"
                         onChange={setAmountAssetFilter}>
                <option id="all-amount" value="*">All</option>
                {amountAssets.map(({id, ticker}) => <option key={`filter-${id}-amount`} id={`filter-${id}-amount`}
                                                            value={id}>{ticker}</option>)}
            </Form.Select>
        </Col>
        <Col>
            <Form.Label htmlFor="priceAssetSelect"><small>Price Asset</small></Form.Label>
            <Form.Select size="sm" id="priceAssetSelect" aria-describedby="amount asset" onChange={setPriceAssetFilter}>
                <option id="all-price" value="*">All</option>
                {
                    priceAssets.map(({id, ticker}) =>
                        <option key={`filter-${id}-price`} id={`filter-${id}-price`} value={id}>{ticker}</option>
                    )
                }
            </Form.Select>
        </Col>
        <Col></Col>
        <Col></Col>
    </Row>
};