import {Button, Col} from "react-bootstrap";
import {useCallback, useState} from "react";
import {VotingModal} from "./VotingModal";


export const AdminVoting = ({ isAdmin, globalSettings, user, signTransactionsPackage, children, ...props }) => {

    const [isShowModal, setIsShowModal ] = useState(false);
    const showModal = useCallback((ev) => {
        ev.stopPropagation();
        ev.preventDefault();
        setIsShowModal(true);
    }, [setIsShowModal]);
    const closeModal = useCallback((ev) => {
        setIsShowModal(false);
    }, [setIsShowModal]);


    const stopPropagation = useCallback((ev) => {
        ev.preventDefault();
        ev.stopPropagation();
    }, []);

    return <Col {...props} hidden={!isAdmin} onClick={stopPropagation}>
        <Button className="bi bi-check2-circle m-1" variant="outline-info" size="sm"
                onClick={showModal}
                title={"Admin voting"}/>
        <VotingModal show={isShowModal} closeModal={closeModal} globalSettings={globalSettings} user={user} signTransactionsPackage={signTransactionsPackage}/>
        {children}
    </Col>;
};

AdminVoting.displayName = 'AdminVoting';