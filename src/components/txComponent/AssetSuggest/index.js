import {InputGroup, Form, Dropdown, ButtonGroup, Spinner} from "react-bootstrap";
import {useCallback} from "react";
import {AssetState} from "./AssetState";


export const AssetSuggest = ({fieldName = '', asset, assets, selectAsset, ...props}) => {

    const {onSuggest, suggest, isLoading, filteredAsset, clearSuggest} = AssetState(assets || {});

    const prevent = useCallback((e) => {
        e.stopPropagation();
        e.preventDefault();
    }, []);


    const onSelectAsset = useCallback((e) => {
        const asset = assets[e.target.id];
        selectAsset(asset);
        clearSuggest();
    }, [assets, onSuggest]);

    return <InputGroup {...props}>
        <Dropdown as={ButtonGroup}  title={`${fieldName} Asset`}>
            <Dropdown.Toggle variant="secondary" style={{ width: '160px' }} >{`${fieldName} Asset`}</Dropdown.Toggle>

            <Dropdown.Menu>

                <Dropdown.Item onClick={prevent}>
                    <Form.Group>
                         <Form.Control size="sm" type="email" placeholder="Enter asset id or ticker"
                                      onInput={onSuggest} value={suggest}/>
                    </Form.Group>
                </Dropdown.Item>
                { isLoading && <Spinner size={'sm'}/> }
                <Dropdown.Divider/>

                {
                    filteredAsset.map(([id, asset]) => {
                        return <Dropdown.Item onClick={onSelectAsset} id={id}
                                              key={id}>{asset.ticker || asset.assetName || asset.asset.name}</Dropdown.Item>
                    })
                }
            </Dropdown.Menu>
        </Dropdown>
        <InputGroup.Text className={'flex-fill ' + (asset ? 'bg-success' : 'bg-danger')}>
            {asset ? asset.ticker || asset.assetName || asset.asset.name || asset.id : 'Select asset'}
        </InputGroup.Text>
    </InputGroup>
};