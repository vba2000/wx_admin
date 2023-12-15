import {Button, Form, InputGroup} from "react-bootstrap";
import {useFeeState} from "./useFeeState";
import {InputWithDecimals} from "../../InputWithDecimals";


export const FeeAmount = ({ feeAsset, tx, onChange, ...props }) => {

    const { fee, setFee, resetFee } = useFeeState({ tx, feeAsset, onChange });

    return <InputGroup {...props}>
        <Button variant="secondary" style={{ width: '160px' }} onClick={resetFee}>Tx Fee</Button>
        <InputWithDecimals size={'-'} decimals={feeAsset && feeAsset.asset.decimals || 0} value={fee} onChange={setFee}/>
    </InputGroup>
};