import {Accordion, Col, Container, Form, Row} from "react-bootstrap";
import {PoolHeader} from "./PoolHeader";
import {PoolForm} from "./PoolForm";
import React, {useCallback, useContext, useMemo, useState} from "react";
import {DataContext} from "../../context/Data";
import {PoolListFilters} from "./PoolListFilters";


export const PoolList = (params) => {
    const { isLoadingData, hasError, assets, pools } = useContext(DataContext);
    const [poolsList, setPoolList] = useState([]);

    if (isLoadingData || hasError) return null;

    return<Col className="m-2">
        <PoolListFilters setPoolList={setPoolList}/>
        <Accordion>
            {poolsList.map(([, pool]) =>
                (<Accordion.Item eventKey={pool.address} key={pool.address} className="m-0">
                    <PoolHeader poolData={pool}/>
                    <Accordion.Body className={"bg-light"}>
                        <PoolForm pool={pool}/>
                    </Accordion.Body>
                </Accordion.Item>))
            }
        </Accordion>
    </Col>;
}