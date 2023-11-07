import {Button, Container, Modal} from "react-bootstrap";

export const SaveAssetDataModal = ({diff, asset, isShow, hideModal, ...params}) => {


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
        </Modal.Footer>
    </Modal>;
};