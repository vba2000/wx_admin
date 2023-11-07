import {Badge, Button, Col, Form, ListGroup, Modal, Row} from "react-bootstrap";
import {useVoteData} from "./voteData";
import {useCallback, useMemo, useState} from "react";
import {checkAddress} from "../../services";


const AdminItem = ({admin, toDelete, isLoading, isAdmin, ...props}) => {
    const isToDelete = toDelete[admin];
    return <Row style={{cursor: isAdmin ? 'pointer' : undefined, color: isToDelete ? 'red' : 'green'}}>
        <Col md={11}>
            {isToDelete ? <del>{admin}</del> : admin}
        </Col>
        <Col md={1}>
            {isToDelete ? "✘" : "✓"}
        </Col>
    </Row>
};

const AddNewAdmin = ({newAdmin, hasError, setNewAdmin, ...props}) => {

    const onChange = useCallback((e) => {
        setNewAdmin(e.target.value);
    }, [setNewAdmin]);

    return <Row>
        <Col>
            <Form.Control size="sm" type="text" placeholder="Add new admin" value={newAdmin} onChange={onChange}/>
            {hasError ? <Badge bg="danger">{hasError}</Badge> : ''}
        </Col>
    </Row>
};

export const AdminListModal = ({show, closeModal, globalSettings, user, signTransactionsPackage, ...props}) => {

    const [toDelete, setToDelete] = useState({});
    const [newAdmin, setNewAdmin] = useState('');
    const [newAdminError, setNewAdminError] = useState(null);

    const hasToDelete = !!Object.values(toDelete).length;

    const hasChanges = useMemo(() => {
        return !newAdminError && (hasToDelete || newAdmin);
    }, [hasToDelete, newAdmin, newAdminError]);

    const onChangeAdmin = useCallback((newAdmin) => {
        let adminError = checkAddress(newAdmin);
        if (!adminError && globalSettings.admins.includes(newAdmin)) {
            adminError = 'Already exist';
        }
        setNewAdminError(adminError);
        setNewAdmin(newAdmin);
    }, [setNewAdmin, setNewAdminError, globalSettings.admins]);


    const {
        isAdmin,
        isLoading,
        setAdmins,
    } = useVoteData(user, globalSettings, closeModal, signTransactionsPackage);

    const sendTx = useCallback(() => {
        setAdmins(newAdmin, toDelete);
    }, [newAdmin, toDelete, setAdmins]);

    const onAdminClick = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isAdmin) {
            return;
        }
        const user = e.currentTarget.getAttribute('ids');
        toDelete[user] = !toDelete[user];

        if (!toDelete[user]) {
            delete toDelete[user];
        }
        setToDelete({...toDelete});
    }, [setToDelete, toDelete, isAdmin]);


    return <Modal show={show} onHide={isLoading ? undefined : closeModal} centered>
        <Modal.Header closeButton={!isLoading}>
            <Modal.Title>Admins list</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <ListGroup>
                {
                    (globalSettings.admins || []).map(admin => <ListGroup.Item onClick={onAdminClick} ids={admin}
                                                                               key={admin}>
                        <AdminItem admin={admin} isAdmin={isAdmin} toDelete={toDelete}/>
                    </ListGroup.Item>)
                }
                {
                    isAdmin && <AddNewAdmin newAdmin={newAdmin} setNewAdmin={onChangeAdmin} hasError={newAdminError}/>
                }
            </ListGroup>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={closeModal} disabled={isLoading}>
                Close
            </Button>
            <Button disabled={!hasChanges || isLoading} variant="warning" onClick={sendTx} className={"mx-1"}>
                Save Changes
            </Button>
        </Modal.Footer>
    </Modal>
};