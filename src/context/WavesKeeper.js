import {createContext, useCallback, useState} from 'react';
import {checkNodeNetworkByte} from "../services";


class WavesKeeper {
    keeperState = null;
    user = 'Guest';
    isLogin = false;

    async login(isGuest = false) {
        if (isGuest) {
            this.user = "Guest";
            this.isLogin = true;
            this.keeperState = {};
            return;
        }
        try {
            const state = await window.KeeperWallet.publicState();
            this.user = state.account.address;
            await checkNodeNetworkByte(this.user);
            this.keeperState = state;
            this.isLogin = true;
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
    const [txLoading, setTxLoading] = useState(false);
    const [isLogin, setIsLogin] = useState(false);
    const [hasError, setError] = useState(null);
    const login = useCallback((data) => {
        keeper.login(data).then(() => {
            setUser(keeper.user);
            setIsLogin(true);
        });
    }, [keeper]);
    const logout = useCallback(() => {
        keeper.logout().then(() => {
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
        user, logout, login, signTransactionsPackage, txLoading, isLogin, hasError
    };
};

export const UserContext = createContext(null);