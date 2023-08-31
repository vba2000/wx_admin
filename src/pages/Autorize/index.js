import {useContext} from "react";
import {UserContext} from "../../context/WavesKeeper";
import {LoginPage} from "./LoginPage";


export const Autorize = ({ children, ...props }) => {
    const {isLogin} = useContext(UserContext);

    return <>
        { isLogin ? {...children} : <LoginPage/> }
    </>
};