import {Accordion, Col} from "react-bootstrap";
import {PoolHeader} from "./PoolHeader";
import {PoolForm} from "./PoolForm";
import React, {useContext, useMemo, useState} from "react";
import {DataContext} from "../../../context/Data";
import {PoolListFilters} from "./PoolListFilters";
import {UserContext} from "../../../context/WavesKeeper";


export const PoolList = (params) => {
    const { isLoadingData, hasError, globalPoolsSettings, assets } = useContext(DataContext);
    const {user} = useContext(UserContext);
    const [poolsList, setPoolList] = useState([]);
    const isManger = useMemo(() => user === globalPoolsSettings.manager, [user, globalPoolsSettings.manager]);

    return<Col className="m-2" hidden={isLoadingData || hasError}>
        <PoolListFilters setPoolList={setPoolList}/>
        <Accordion>
            {poolsList.map(([, pool]) =>
                (<Accordion.Item eventKey={pool.address} key={pool.address} className="m-0">
                    <PoolHeader poolData={pool} assets={assets}/>
                    <Accordion.Body className={"bg-light"}>
                        <PoolForm pool={pool} isManager={isManger} assets={assets}/>
                    </Accordion.Body>
                </Accordion.Item>))
            }
        </Accordion>
    </Col>;
};