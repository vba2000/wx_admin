import {useCallback, useMemo, useState} from "react";
import {
    activateNewManager,
    adminVoteForNewManager,
    broadcastAndWaitTxs,
    checkPublicKey,
    editAdmins
} from "../../services";


export const useVoteData = (user, globalSettings, closeModal, signTransactionsPackage) => {

    const hasNewVote = useMemo(() => {
        return !!globalSettings.pendingManager && globalSettings.pendingManager !== globalSettings.manager;
    }, [globalSettings.pendingManager, globalSettings.manager]);

    const isManager = useMemo(() => globalSettings.manager === user, [globalSettings.manager, user]);

    const iAmNewManager = useMemo(() => globalSettings.pendingManager && user === globalSettings.pendingManager, [user, globalSettings.pendingManager]);

    const isAdmin = useMemo(() => (globalSettings.admins || []).includes(user), [user, globalSettings.admins]);

    const [newAdmin, setNewAdmin] = useState(hasNewVote ? globalSettings.pendingManagerPublicKey : '');
    const [isLoading, setIsLoading] = useState(false);
    const [errorPk, setErrorPk] = useState(false);
    const [errorVote, setErrorVote] = useState(false);

    const onChangePublicKey = useCallback((event) => {
        setNewAdmin(event.target.value);
    }, [setNewAdmin]);

    const vote = useCallback(async () => {
        const isValidPk = checkPublicKey(newAdmin);
        setErrorPk(!isValidPk);
        setErrorVote(false);
        if (!isValidPk) {
            return;
        }
        setIsLoading(true);
        try {
            const tx = adminVoteForNewManager(newAdmin, globalSettings.managerContract);
            const txs = await signTransactionsPackage([tx]);
            const data = await broadcastAndWaitTxs(txs);
            closeModal();
        } catch (e) {
            setErrorVote(true);
        }
        setIsLoading(false);
    }, [newAdmin, globalSettings.managerContract, closeModal, setErrorVote, signTransactionsPackage]);

    const activateManager = useCallback(async () => {
        setErrorVote(false);
        setIsLoading(true);
        try {
            const tx = activateNewManager(globalSettings.managerContract);
            const txs = await signTransactionsPackage([tx]);
            await broadcastAndWaitTxs(txs);
            closeModal();
        } catch (e) {
            setErrorVote(true);
        }
        setIsLoading(false);
    }, [setErrorVote, setIsLoading, closeModal, signTransactionsPackage, globalSettings.managerContract]);

    const setAdmins = useCallback(async (newAdmin, toDelete) => {
        setErrorVote(false);
        setIsLoading(true);

        try {
            const txs = await signTransactionsPackage(editAdmins(globalSettings.managerContract, newAdmin, toDelete));
            const data = await broadcastAndWaitTxs(txs);
            setIsLoading(false);
            if (!txs) {
                throw new Error('Keeper Rejected');
            }
            return data;
        } catch (e) {
            const err = await e;
            setErrorVote(err);
            throw err;
        }

    }, [setErrorVote, setIsLoading, isManager, globalSettings.managerContract, signTransactionsPackage]);

    return {setErrorVote, isAdmin, isManager, setAdmins, hasNewVote, isLoading, newAdmin, onChangePublicKey, vote, activateManager, errorPk, errorVote, iAmNewManager};
}