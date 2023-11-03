import {Accordion, Col, Row} from "react-bootstrap";
import React, {useContext, useEffect, useMemo, useState} from "react";
import {DataContext} from "../../../context/Data";
import {UserContext} from "../../../context/WavesKeeper";
import {AssetHeader} from "./AssetHeader";
import {FilterList} from "./FilterList";
import {AssetForm} from "./AssetForm";
import {DefaultMinAmount} from "./DefaultMinAmount";


export const AssetList = (params) => {
    const {isLoadingData, hasError, globalPoolsSettings, assets} = useContext(DataContext);
    const {user} = useContext(UserContext);
    const [assetList, setAssetList] = useState([]);
    const isManger = useMemo(() => user === globalPoolsSettings.manager, [user, globalPoolsSettings.manager]);

    useEffect(() => {
        if (!globalPoolsSettings.assetsMinAmount || !assets) {
            return;
        }

        const assetsList = Object.values(Object.entries(assets)
            .map(([id, asset]) => ({...asset, assetsMinAmount: globalPoolsSettings.assetsMinAmount[id]}))
            .reduce((acc, item) => {
                acc[item.id] = item
                return acc;
            }, {}));

        setAssetList(assetsList);
    }, [globalPoolsSettings.assetsMinAmount, assets]);

    const [listToRender, setListToRender] = useState([]);

    return <Col className="m-2" hidden={isLoadingData || hasError}>
        <Row><FilterList list={assetList} setFilteredList={setListToRender}><DefaultMinAmount
            poolAssetDefaultMinAmount={globalPoolsSettings.poolAssetDefaultMinAmount} isAdmin={isManger}/></FilterList></Row>
        <Accordion activeKey={!isManger ? "no" : undefined}>
            {
                listToRender.map(asset =>
                    (<Accordion.Item eventKey={asset.asset.assetId} key={asset.asset.assetId} className="m-0">
                        <AssetHeader assetData={asset}/>
                        <Accordion.Body className={"bg-light"}>
                            <AssetForm asset={asset}/>
                        </Accordion.Body>
                    </Accordion.Item>))
            }
        </Accordion>
    </Col>;
};