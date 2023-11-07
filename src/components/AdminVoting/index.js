import {Button, Col} from "react-bootstrap";
import {useCallback, useMemo, useState} from "react";
import {VotingModal} from "./VotingModal";
import {ActivateModal} from "./ActivateModal";
import {AdminListModal} from "./AdminListModal";


export const AdminVoting = ({isAdmin, globalSettings, user, signTransactionsPackage, children, ...props}) => {

    const [isShowModal, setIsShowModal] = useState(false);
    const showModal = useCallback((ev) => {
        ev.stopPropagation();
        ev.preventDefault();
        setIsShowModal(true);
    }, [setIsShowModal]);
    const closeModal = useCallback((ev) => {
        setIsShowModal(false);
    }, [setIsShowModal]);

    const [isShowActivateModal, setIsShowActivateModal] = useState(false);
    const showActivateModal = useCallback((ev) => {
        ev.stopPropagation();
        ev.preventDefault();
        setIsShowActivateModal(true);
    }, [setIsShowActivateModal]);
    const closeActivateModal = useCallback((ev) => {
        setIsShowActivateModal(false);
    }, [setIsShowActivateModal]);

    const [isShowUserList, setIsShowUserList] = useState(false);
    const showUserListModal = useCallback((ev) => {
        ev.stopPropagation();
        ev.preventDefault();
        setIsShowUserList(true);
    }, [setIsShowUserList]);
    const closeUserListeModal = useCallback((ev) => {
        setIsShowUserList(false);
    }, [setIsShowUserList]);


    const stopPropagation = useCallback((ev) => {
        ev.preventDefault();
        ev.stopPropagation();
    }, []);

    const {mangerInVote, manager} = globalSettings;
    const {needMyApprove} = useMemo(() => {
        const votingEnd = mangerInVote !== manager;
        const needMyApprove = mangerInVote === user && votingEnd;
        return {votingEnd, needMyApprove};
    }, [user, mangerInVote, manager]);

    return <Col {...props} hidden={!isAdmin} onClick={stopPropagation}>
        <Button as='a' className="bi bi-check2-circle m-1" variant="outline-info" size="sm"
                onClick={showModal}
                title={"Admin voting"}/>
        <Button as='a' className="bi bi-person-check-fill m-1" variant="outline-info" size="sm" hidden={!needMyApprove}
                title="Activate admin" onClick={showActivateModal}/>
        <Button as='a' className="bi bi-people m-1" variant="outline-info" size="sm"
                title="Activate admin" onClick={showUserListModal}/>
        <VotingModal show={isShowModal} closeModal={closeModal} globalSettings={globalSettings} user={user}
                     signTransactionsPackage={signTransactionsPackage}/>
        <ActivateModal show={isShowActivateModal} closeModal={closeActivateModal} globalSettings={globalSettings}
                       user={user} signTransactionsPackage={signTransactionsPackage}/>
        <AdminListModal closeModal={closeUserListeModal} user={user} globalSettings={globalSettings}
                        signTransactionsPackage={signTransactionsPackage} show={isShowUserList}/>
        {children}
    </Col>;
};

AdminVoting.displayName = 'AdminVoting';