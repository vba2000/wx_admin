import {Button, Col, Row} from "react-bootstrap";
import {copyTextToClipboard} from "../../../services/Copy";
import React, {useCallback, useContext, useState} from "react";
import {ToastContext} from "../../Toasts";
import {JSONShow} from "../JSONShow";


export const SubmitTx = ({ tx, onSubmitTx, ...props }) => {
    const {addNewMessage} = useContext(ToastContext);
    const [isShowJson, setShowJson] = useState(false);

    const onCopy = useCallback((e) => {
        e.stopPropagation();
        e.preventDefault();
        copyTextToClipboard(JSON.stringify(tx, null, 4));
        addNewMessage({ text: `TX JSON copied`, timeout: 1000, variant: 'light' })
    }, [addNewMessage, tx]);

    const toggleJSON = useCallback(() => {
        setShowJson(!isShowJson)
    }, [isShowJson]);

    return <>
    { isShowJson && tx.id && <Row className={'m-2'}><Col><JSONShow json={tx}/></Col></Row> }

        <Row className={'my-2 align-items-center'} {...props}>
            <Col className={'m-2 align-items-center'} >
                <Button className={'mx-1'} variant={'info'} onClick={toggleJSON}>{isShowJson ? 'Hide JSON' : 'Show JSON'}</Button>
                <Button className={'mx-1'} variant={'secondary'} onClick={onCopy}>Copy JSON</Button>
                <Button className={'mx-1'} variant={'primary'} onClick={onSubmitTx}>Send Tx</Button>
            </Col>
        </Row>
    </>;
};