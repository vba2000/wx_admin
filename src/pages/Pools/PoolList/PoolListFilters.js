import {Button, Col, Form, InputGroup, Row} from "react-bootstrap";
import React, {useCallback, useContext, useEffect, useMemo, useState} from "react";
import {DataContext} from "../../../context/Data";


export const PoolListFilters = ({setPoolList, ...props}) => {

    const {assets, hasData, pools} = useContext(DataContext);
    const [filters, setFilters] = useState({amountAsset: '*', priceAsset: '*', search: ''});
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
        } else if (filters.search) {
            const amountName = assets[pool.amountAssetId]?.ticker;
            const priceName = assets[pool.priceAssetId]?.ticker;
            const poolName = `${amountName || 'no name'}/${priceName || 'no'}`.toLowerCase();
            if (!poolName.includes(filters.search.toLowerCase())) {
                return false;
            }
        }

        return true;
    }), [poolsList, filters, assets]);


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

    const setSearchFilter = useCallback((e) => {
        const search = e.target.value;
        const filter = {...filters, search};
        setFilters(filter);
    }, [filters]);

    const clearSearch = useCallback(() => {
        const search = '';
        const filter = {...filters, search};
        setFilters(filter);
    }, [filters]);

    if (!hasData) {
        return null;
    }

    return <Row className={'m-0 p-2 border border-bottom-0'}>
        <Col sm={4} md={4} lg={3} xl={2} xxl={2}>
            <InputGroup className="m-2" size={"sm"}>
                <InputGroup.Text id="poolSearch"><small>Search</small></InputGroup.Text>
                <Form.Control
                    size={"sm"}
                    value={filters.search}
                    placeholder="Pool name"
                    aria-label="Search"
                    aria-describedby="poolSearch"
                    onChange={setSearchFilter}
                />
                <InputGroup.Text id="poolSearch"><small className={"btn btn-sm p-0 m-0 px-1"} onClick={clearSearch}>x</small></InputGroup.Text>
            </InputGroup>
        </Col>
        <Col sm={4} md={4} lg={3} xl={2} xxl={2}>
            <InputGroup className="m-2" size={"sm"}>
                <InputGroup.Text id="amountAssetSelect"><small>Amount</small></InputGroup.Text>
                <Form.Select size="sm" id="amountAssetDropDown" aria-describedby="amountAssetSelect"
                             onChange={setAmountAssetFilter}>
                    <option id="all-amount" value="*">All</option>
                    {amountAssets.map(({id, ticker}) => <option key={`filter-${id}-amount`} id={`filter-${id}-amount`}
                                                                value={id}>{ticker}</option>)}
                </Form.Select>
            </InputGroup>
        </Col>
        <Col sm={4} md={4} lg={3} xl={2} xxl={2}>
            <InputGroup className="m-2" size={"sm"}>
                <InputGroup.Text id="priceAssetSelect"><small>Price</small></InputGroup.Text>
                <Form.Select size="sm" id="priceAssetSelectDrop" aria-describedby="priceAssetSelect"
                             onChange={setPriceAssetFilter}>
                    <option id="all-price" value="*">All</option>
                    {
                        priceAssets.map(({id, ticker}) =>
                            <option key={`filter-${id}-price`} id={`filter-${id}-price`} value={id}>{ticker}</option>
                        )
                    }
                </Form.Select>
            </InputGroup>
        </Col>
        <Col></Col>
        <Col></Col>
    </Row>
};