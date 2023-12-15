import {Button, Col, Container, Form, Row, Table} from "react-bootstrap";
import {useCallback, useContext, useEffect, useMemo, useState} from "react";
import {DataContext} from "../../../context/Data";
import {StatsItem} from "./StatsItem/StatsItem";


export const PoolStats = ({ ...props }) => {

    const { isLoadingData, poolStats, assets, globalPoolsSettings } = useContext(DataContext);

    const [statsItems, setStatItems] = useState(poolStats.items || []);

    const [selectedItems, setSelectedItems] = useState([]);

    const [hideLowLiq, setHideLowLiq] = useState(false);
    const [showBotStopped , setShowBotStopped] = useState(false);
    const [showBotRunning , setShowBotRunning] = useState(false);

    const onChangeHideLowLiq = useCallback(() => setHideLowLiq(!hideLowLiq),[setHideLowLiq, hideLowLiq] );
    const onChangeShowBotStopped = useCallback(() => setShowBotStopped(!showBotStopped),[setShowBotStopped, showBotStopped] );
    const onChangeShowBotRunning = useCallback(() => setShowBotRunning(!showBotRunning),[setShowBotRunning, showBotRunning] );

    const showSelected = useCallback(() => {
        const items = statsItems.filter(i => i.selected);
        setSelectedItems(items);
    }, [setSelectedItems, statsItems]);

    const hideSelected = useCallback(() => setSelectedItems([]), [setSelectedItems]);

    useEffect(() => {
        const items = (poolStats.items || []).map((item) => {
            const baseApy = (item.base_apys[0] || { base_apy: 0 }).base_apy || 0;
            const maxApy = Number(baseApy) + Number(item.reward_apy_max);
            return { ...item, baseApy, maxApy };
        });
        setStatItems(items.sort((a, b) => b.maxApy - a.maxApy));
    }, [poolStats.items]);


    const isShowSelected = useMemo(() => !!selectedItems.length, [selectedItems]);

    return <Container hidden={isLoadingData}>
        <Row className={'my-4'}>
            <Col>
                <Button onClick={isShowSelected ? hideSelected : showSelected}>{isShowSelected ? 'Hide' : 'Show'} selected</Button>
            </Col>
            <Col>
                <Form.Check
                    type="switch"
                    id="select"
                    label="Hide bot running"
                    onChange={onChangeShowBotStopped}
                    checked={showBotStopped}
                />
            </Col>
            <Col>
                <Form.Check
                    type="switch"
                    id="select"
                    label="Hide bot stopped"
                    onChange={onChangeShowBotRunning}
                    checked={showBotRunning}
                />
            </Col>
            <Col>
                <Form.Check
                    type="switch"
                    id="select"
                    label="Hide Liqudity < $300"
                    onChange={onChangeHideLowLiq}
                    checked={hideLowLiq}
                />
            </Col>
        </Row>
        <Row className={'pb-2 mx-0'}>
            <Table className={'table-bordered table-primary table-striped-columns'}>
            {
                selectedItems.map(i => (
                        <tr key={i.address} className={'border border-black p-2'} style={{textAlign: 'end'}}>
                            <td>{new Date().toISOString().split('T')[0].replace(/-/g, '.')}</td><td>{i.poolName}</td><td>{i.liquidiy}</td><td>{Number(i.maxApy).toFixed(2)} %</td><td>{i.link}</td>
                        </tr>))
            }
            </Table>
        </Row>
        <Row className={'bg-secondary'}>
            <Col md={2}>Pool Name</Col>
            <Col md={1}>Liquidity</Col>
            <Col md={1}>APY</Col>
            <Col md={3}>Address</Col>
            <Col>Amount</Col>
            <Col>Price</Col>
            <Col >Select</Col>
        </Row>
        {
            statsItems.map((item) => <StatsItem key={item.address} data={item} assets={assets} hideLowLiq={hideLowLiq} showBotStopped={showBotStopped} globalSettings={globalPoolsSettings} showBotRunning={showBotRunning}/>)
        }
    </Container>;
};