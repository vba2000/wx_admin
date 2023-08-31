import {Alert, Button, Col, Form, Modal, Row, Spinner} from "react-bootstrap";
import {useVoteData} from "./voteData";


export const VotingModal = ({show, closeModal, globalSettings, signTransactionsPackage, user, ...props}) => {

    const {
        isAdmin,
        hasNewVote,
        isLoading,
        newAdmin,
        onChangePublicKey,
        vote,
        errorPk,
        errorVote,
    } = useVoteData(user, globalSettings, closeModal, signTransactionsPackage);

    return <Modal show={show} onHide={isLoading ? undefined : closeModal} centered>
        <Modal.Header closeButton={!isLoading}>
            <Modal.Title>Voting for admin</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form.Group as={Row} className="mb-2" controlId="currentVote">
                <Form.Label column md="3">
                    New Manger
                </Form.Label>
                <Col md="9">
                    <Form.Control size={"sm"}
                                  value={newAdmin}
                                  onChange={onChangePublicKey}
                                  readOnly={hasNewVote || isLoading}
                                  placeholder={"Public Key"}/>
                </Col>
            </Form.Group>
            <Alert variant={"warning"} hidden={!errorPk}>Incorrect Public Key!</Alert>
            <Alert variant={"warning"} hidden={!errorVote}>Send failed! Try again!</Alert>
        </Modal.Body>
        <Modal.Footer>
            {
                isLoading ? <Spinner size={"sm"}/> : <>
                    <Button variant="secondary" onClick={closeModal} disabled={isLoading}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={vote} disabled={isLoading || !isAdmin}>
                        Vote
                    </Button>
                </>
            }
        </Modal.Footer>
    </Modal>
};