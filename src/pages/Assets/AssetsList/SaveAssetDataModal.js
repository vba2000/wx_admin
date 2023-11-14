import {Button, Container, Modal} from "react-bootstrap";
import {useCallback, useContext} from "react";
import {UserContext} from "../../../context/WavesKeeper";

export const SaveAssetDataModal = ({diff, asset, isShow, hideModal, ...params}) => {

    const {signTransactionsPackage, txLoading} = useContext(UserContext);

    const saveAssetData = useCallback(() => {
        const toSave = {};
        if ('logo' in diff) {
            toSave.logo = diff.logo ?
                atob(diff.logo.split('base64,')[1].trim()).replaceAll('\n', '')
                    .replaceAll('\t', '').replace('<?', '<')
                    .replace('?>', '>') : null;
        }

        if ('ticker' in diff) {
            toSave.ticker = diff.ticker;
        }

        if ('minAmount' in diff) {
            toSave.minAmount = diff.assetsMinAmount;
        }


    }, [diff]);

    if (!isShow) {
        return;
    }

    return <Modal show={isShow}
                  backdrop="static"
                  keyboard={false}
                  size="lg"
                  aria-labelledby="contained-modal-title-vcenter"
                  centered>
        <Modal.Header>
            <Modal.Title>Save settings for <h6>{asset.ticker || asset.assetName || asset.asset.name}</h6></Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Container>

            </Container>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="primary" onClick={hideModal} className={"mx-1"}>
                Close
            </Button>
            <Button variant="" onClick={saveAssetData}>Save</Button>
        </Modal.Footer>
    </Modal>;
};