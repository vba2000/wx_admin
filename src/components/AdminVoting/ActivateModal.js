import {Alert, Button,  Form, Modal,  Spinner} from "react-bootstrap";
import {useVoteData} from "./voteData";


export const ActivateModal = ({show, closeModal, globalSettings, signTransactionsPackage, user, ...props}) => {

    const {
        iAmNewManager,
        isLoading,
        activateManager,
        errorVote,
    } = useVoteData(user, globalSettings, closeModal, signTransactionsPackage);

    return <Modal show={show} onHide={isLoading ? undefined : closeModal} centered>
        <Modal.Header closeButton={!isLoading}>
            <Modal.Title>Activate admin</Modal.Title>
        </Modal.Header>
        <Modal.Body>
                <Form.Label column md="3">
                    Activate New Manger
                </Form.Label>
            <Alert variant={"warning"} hidden={!errorVote}>Send failed! Try again!</Alert>
        </Modal.Body>
        <Modal.Footer>
            {
                isLoading ? <Spinner size={"sm"}/> : <>
                    <Button variant="secondary" onClick={closeModal} disabled={isLoading}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={activateManager} disabled={isLoading || !iAmNewManager}>
                        Activate new manager
                    </Button>
                </>
            }
        </Modal.Footer>
    </Modal>
};