import {Button, Col, Form, FormGroup, InputGroup, Row} from "react-bootstrap";
import React, {useCallback, useContext, useState} from "react";
import {DataContext} from "../../../context/Data";
import {checkId, fetchAssets} from "../../../services";


export const AddAsset = ({ ...props }) => {

    const {assets, setAssets} = useContext(DataContext);
    const [toAdd, setToAdd] = useState('');


    const onChange = useCallback(async (e) => {
        const id = e.currentTarget.value;
        try {
            if (checkId(id) && !assets[id]) {
                const asset = (await fetchAssets(id));
                setToAdd({...assets, [id]: {asset, id: asset.assetId}});
                return;
            }
        } catch (e) {
        }
        setToAdd(null);
    }, [setToAdd, assets]);

    const addToAssets = useCallback(() => {
        setAssets(toAdd);
        setToAdd('');
    }, [toAdd, setAssets]);


    return <Row className={'mb-2 pb-3 border-1 border-dark-subtle border-bottom'}>
            <Col sm={6} md={6} lg={6} xl={4} xxl={4} className="">
                <FormGroup>
                    <InputGroup size={"sm"}>
                        <InputGroup.Text id="assetFind"><small>Add by assetId</small></InputGroup.Text>
                        <Form.Control
                            size={"sm"}
                            placeholder="Asset Id"
                            aria-label="Search"
                            aria-describedby="assetFind"
                            onChange={onChange}
                        />
                        <Button disabled={!toAdd} onClick={addToAssets} >Add</Button>
                    </InputGroup>
                </FormGroup>
            </Col>
        </Row>;
};