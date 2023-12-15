import {Button, Form, InputGroup} from "react-bootstrap";
import { libs } from '@waves/waves-transactions';
import {useCallback, useMemo} from "react";


export const Attachment = ({ value,onChange, ...props}) => {
    const attachment = useMemo(() => libs.crypto.bytesToString(libs.crypto.base58Decode(value)), [value]);
    const onChangeMsg = useCallback((e) => {
        const bytes = libs.crypto.stringToBytes(e.target.value);
        const trueBytes = bytes.slice(0, 140);
        onChange(libs.crypto.base58Encode(trueBytes));
    }, [onChange]);

    return <InputGroup {...props}>
        <Button  variant="secondary" style={{ width: '160px' }}  disabled={true}>Attachment</Button>
        <Form.Control
            placeholder="attachment"
            value={attachment}
            onChange={onChangeMsg}
        />
        <InputGroup.Text className={'bg-success'}>Valid</InputGroup.Text>
    </InputGroup>
};