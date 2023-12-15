import {Button, InputGroup} from "react-bootstrap";
import {InputWithDecimals} from "../../InputWithDecimals";
import {useCallback} from "react";
import {getBalanceByAddressAndAssetId} from "../../../services";


export const AmountInput = ({ value, asset, onChange, fieldName, address, ...props }) => {

    const getBalance = useCallback(async () => {
        const balance = await getBalanceByAddressAndAssetId(address, asset.id);
        onChange(balance.balance);
    }, [address, onChange, asset]);

    return <InputGroup {...props}>
        <Button variant="secondary" style={{ width: '160px' }} onClick={getBalance} disabled={!address || !asset}>{fieldName || 'Amount'}</Button>
        <InputWithDecimals size={'-'} decimals={asset && asset.asset.decimals || 0} value={value} onChange={onChange}/>
    </InputGroup>
};