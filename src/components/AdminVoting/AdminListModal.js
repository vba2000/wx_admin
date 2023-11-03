import {Button,  ListGroup, Modal} from "react-bootstrap";
import {useVoteData} from "./voteData";


export const AdminListModal = ({show, closeModal, globalSettings, user, ...props}) => {

    const {
        isLoading,
    } = useVoteData(user, globalSettings, closeModal);

    return <Modal show={show} onHide={isLoading ? undefined : closeModal} centered>
        <Modal.Header closeButton={!isLoading}>
            <Modal.Title>Admins list</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <ListGroup>
                {
                    (globalSettings.admins || []).map(admin => <ListGroup.Item>{admin}</ListGroup.Item>)
                }
            </ListGroup>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={closeModal} disabled={isLoading}>
                Close
            </Button>
        </Modal.Footer>
    </Modal>
};