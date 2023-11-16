import {Col, Container, FormGroup, InputGroup, Row, Form, Button} from "react-bootstrap";
import {ImgInput} from "../../../components/ImgInput";
import React, {useCallback, useMemo, useState} from "react";
import {InputWithDecimals} from "../../../components/InputWithDecimals";
import {convertSvgString} from "../../../services";
import {SaveAssetDataModal} from "./SaveAssetDataModal";
import {getIconFromBase64} from "../../../services/imageUtils";
import {LabelsForm} from "./LabelsForm";


export const AssetForm = ({asset, labels, ...props}) => {

    const [img, setImg] = useState({
        value: asset.logo ? `data:image/svg+xml;base64, ${convertSvgString(asset.logo)}` : '',
        name: 'Current',
        size: 0
    });


    const [ticker, setTicker] = useState(asset.ticker);
    const [assetLabels, setAssetLabels] = useState(asset.labels || '');

    const onTickerChange = useCallback((e) => {
        setTicker(e.target.value);
    }, [setTicker]);

    const [externalTicker, setExternalTicker] = useState(asset.externalTicker || '');

    const onExternalTickerChange = useCallback((e) => {
        setExternalTicker(e.target.value);
    }, [setExternalTicker]);

    const [minAmount, setMinAmount] = useState(asset.assetsMinAmount);

    const clearChanges = useCallback(() => {
        setImg({
            value: asset.logo ? `data:image/svg+xml;base64, ${convertSvgString(asset.logo)}` : '',
            name: 'Current',
            size: 0
        });
        setExternalTicker(asset.externalTicker);
        setMinAmount(asset.assetsMinAmount);
        setTicker(asset.ticker || '');
    }, [asset.assetsMinAmount, asset.logo, asset.ticker, setImg, asset.externalTicker]);

    const { diff, hasDiff } = useMemo(() => {
        const diff = {};
        let hasDiff = false;

        if ((img.value && !asset.logo) || (!img.value && asset.logo) || (asset.logo && img.value !== `data:image/svg+xml;base64, ${convertSvgString(asset.logo)}`)) {
            diff.logo = getIconFromBase64(img.value);
            hasDiff = true;
        } else {
            delete diff.logo;
        }

        if ((asset.assetsMinAmount || null) !== (minAmount || null)) {
            diff.assetsMinAmount = Number(minAmount);
            hasDiff = true;
        } else {
            delete diff.assetsMinAmount;
        }

        if ((asset.ticker || null) !== (ticker || null)) {
            diff.ticker = ticker;
            hasDiff = true;
        } else {
            delete diff.ticker;
        }

        if ((asset.labels || null) !== (assetLabels || null)) {
            diff.labels = assetLabels;
            hasDiff = true;
        } else {
            delete diff.labels;
        }

        if ((asset.externalTicker || null) !== (externalTicker || null)) {
            diff.externalTicker = externalTicker;
            hasDiff = true;
        } else {
            delete diff.externalTicker;
        }

        return { diff, hasDiff };
    }, [asset.logo, asset.ticker, asset.assetsMinAmount, asset.externalTicker, externalTicker, ticker, minAmount, img, asset.labels, assetLabels]);

    const [showSaveModal, setShowSaveModal] = useState(false);
    const hideModal = useCallback(() => setShowSaveModal(false), []);
    const showModal = useCallback(() => setShowSaveModal(true), []);

    return <Container>
        <Row>
            <Col>
                <ImgInput img={img} setImg={setImg} currentImage={asset.logo}/>
            </Col>
            <Col>
                <FormGroup>
                    <InputGroup className='text-nowrap'>
                        <InputGroup.Text>Ticker</InputGroup.Text>
                        <Form.Control type={'text'} value={ticker} onInput={onTickerChange}/>
                    </InputGroup>
                </FormGroup>
            </Col>
            <Col>
                <FormGroup>
                    <InputGroup className='text-nowrap'>
                        <InputGroup.Text>External Ticker</InputGroup.Text>
                        <Form.Control type={'text'} value={externalTicker} onInput={onExternalTickerChange}/>
                    </InputGroup>
                </FormGroup>
            </Col>
            <Col>
                <FormGroup>
                    <InputGroup className='text-nowrap'>
                        <InputGroup.Text>Min Amount</InputGroup.Text>
                        <InputWithDecimals size=' ' value={minAmount} decimals={asset.asset.decimals}
                                           onChange={setMinAmount}
                                           placeholder={'Min pull amount'} hasDefault={false}/>
                    </InputGroup>
                </FormGroup>
            </Col>
        </Row>
        <hr/>
        <Row>
            <LabelsForm labels={asset.labels || ''} allLabels={labels} onChange={setAssetLabels}/>
        </Row>
        <hr/>
        <Row>
            <Col md={4}>
            </Col>
            <Col>
                <Button variant='secondary' onClick={clearChanges}>Clear changes</Button>
            </Col>
            <Col>
                <Button disabled={!hasDiff} onClick={showModal}>Save changes</Button>
            </Col>
            <Col md={4}>
            </Col>

        </Row>
        <hr/>
        <SaveAssetDataModal asset={asset} diff={diff} hideModal={hideModal} isShow={showSaveModal}/>
    </Container>
};