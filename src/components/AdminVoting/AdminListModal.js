import {Alert, Badge, Button, Col, Container, Form, ListGroup, Modal, Row, Spinner} from "react-bootstrap";
import {useVoteData} from "./voteData";
import {useCallback, useContext, useMemo, useState} from "react";
import {checkAddress} from "../../services";
import {DataContext} from "../../context/Data";


const AdminItem = ({admin, toDelete, isLoading, isAdmin, voteToDeleteResult, voteToAdd, ...props}) => {
    const isToDelete = toDelete[admin];
    const voteNumbers = (voteToDeleteResult[admin] || 0);
    const isInDeleteVote = !!voteToDeleteResult[admin];
    const isInAddVote = !!voteToAdd[admin];
    return <Row style={{
        cursor: isAdmin ? 'pointer' : undefined,
        color: isToDelete ? 'red' : ((isInDeleteVote || isInAddVote) ? 'orange' : 'green')
    }}>
        <Col md={10}>
            {isToDelete ? <del>{admin}</del> : admin}
        </Col>
        <Col md={1}>
            {isToDelete ? "✘" : "✓"}
        </Col>
        <Col md={1} hidden={!voteNumbers}>☠</Col>
        <Col md={1} hidden={!isInAddVote}>✔</Col>
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

    const {fetchData} = useContext(DataContext);

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

    const clearData = useCallback(() => {
        setToDelete({});
        onChangeAdmin('');
    }, [setToDelete, onChangeAdmin, closeModal]);

    const closeModalCb = useCallback(() => {
        clearData();
        closeModal();
    }, [closeModal, clearData]);

    const [isLoading, setIsLoading] = useState(false);

    const {
        isAdmin,
        setAdmins,
        errorVote,
    } = useVoteData(user, globalSettings, closeModalCb, signTransactionsPackage);

    const sendTx = useCallback(async () => {
        setIsLoading(true);
        try {
            await setAdmins(newAdmin, toDelete);
            await fetchData();
        } catch (e) {
            debugger;
        }
        setIsLoading(false);

    }, [newAdmin, toDelete, setAdmins,fetchData]);

    const onAdminClick = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isAdmin) {
            return;
        }

        const user = e.currentTarget.getAttribute('ids');

        if (globalSettings.adminsToAdd[user]) {
            setNewAdmin(user);
            return;
        }

        toDelete[user] = !toDelete[user];

        if (!toDelete[user]) {
            delete toDelete[user];
        }
        setToDelete({...toDelete});
    }, [setToDelete, toDelete, isAdmin, globalSettings.adminsToAdd]);


    const adminList = useMemo(() => {
        return [...(globalSettings.admins || []), ...Object.keys(globalSettings.adminsToAdd)];
    }, [globalSettings.adminsToAdd, globalSettings.admins]);

    return <Modal show={show} onHide={isLoading ? undefined : closeModalCb} centered>
        <Modal.Header closeButton={!isLoading}>
            <Modal.Title>Admins list</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Container>
                <Spinner hidden={!isLoading} variant='success' animation={'border'}/>
                <ListGroup hidden={isLoading}>
                    {
                        adminList.map(admin => <ListGroup.Item onClick={onAdminClick} ids={admin}
                                                                                   key={admin}>
                            <AdminItem admin={admin}
                                       isAdmin={isAdmin}
                                       voteToDeleteResult={globalSettings.adminsToDelete}
                                       toDelete={toDelete}
                                       voteToAdd={globalSettings.adminsToAdd}
                            />
                        </ListGroup.Item>)
                    }
                    {
                        isAdmin &&
                        <AddNewAdmin newAdmin={newAdmin} setNewAdmin={onChangeAdmin} hasError={newAdminError}/>
                    }
                </ListGroup>
                <Alert variant="danger" show={errorVote && !isLoading}><small>{errorVote.message}</small></Alert>
            </Container>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={closeModalCb} disabled={isLoading}>
                Close
            </Button>
            <Button disabled={!hasChanges || isLoading} variant="warning" onClick={sendTx} className={"mx-1"}>
                Save Changes
            </Button>
        </Modal.Footer>
    </Modal>
};