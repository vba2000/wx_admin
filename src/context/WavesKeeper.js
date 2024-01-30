import {createContext, useCallback, useState} from 'react';
import {checkNodeNetworkByte} from "../services";


class WavesKeeper {
    keeperState = null;
    user = 'Guest';
    isLogin = false;
    userData = {};

    async login(isGuest = false) {
        if (isGuest) {
            this.user = "Guest";
            this.isLogin = true;
            this.keeperState = {};
            window.$chatwoot.setUser(`<unique-identifier-key-of-the-user>`, {
                name: this.user, // Name of the user
                email: "", // Email of the user
                identifier_hash: Math.random().toString()  // HMAC value, which is generated using inbox identifier (obtained from inbox settings ) and unique-identifier-key that you supply for the contact.
            });
            return;
        }
        try {
            const state = await window.KeeperWallet.publicState();
            this.userData = state.account;
            this.user = state.account.address;
            await checkNodeNetworkByte(this.user);
            this.keeperState = state;
            this.isLogin = true;
            window.$chatwoot.setUser(this.user, {
                name: state.account.name, // Name of the user
                email: "", // Email of the user
            });
        } catch (e) {
            throw(new Error(e));
        }
    }

    async logout() {
        this.user = 'Guest';
        this.isLogin = false;
    }

    async signTransactionsPackage(data) {
        return window.KeeperWallet.signTransactionPackage(data);
    }

}


export const useUserForRoot = () => {

    const [keeper] = useState(new WavesKeeper());
    const [user, setUser] = useState(keeper.user);
    const [userData, setUserData] = useState(keeper.userData);
    const [txLoading, setTxLoading] = useState(false);
    const [isLogin, setIsLogin] = useState(false);
    const [hasError, setError] = useState(null);
    const login = useCallback((data) => {
        return keeper.login(data).then(() => {
            setUser(keeper.user);
            setUserData(keeper.userData);
            setIsLogin(true);
        });
    }, [keeper]);
    const logout = useCallback(() => {
        return keeper.logout().then(() => {
            setUser(keeper.user);
            setIsLogin(false);
        });
    }, [keeper]);
    const signTransactionsPackage = useCallback((data) => {
        setTxLoading(true);
        return keeper.signTransactionsPackage(data)
            .then((transactions) => {
                setError(null);
                return transactions;
            }).catch((e) => {
                setTxLoading(false);
                setError(e);
            })
            .then((txs) => {
                    setTxLoading(false);
                    return txs;
                });
    }, [keeper]);

    return {
        user, logout, login, signTransactionsPackage, txLoading, isLogin, hasError, userData
    };
};

export const UserContext = createContext(null);