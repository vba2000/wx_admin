import {Container} from "react-bootstrap";
import {useContext, useEffect} from "react";
import {LoadingError} from "./LoadingError";
import {GeneralSettings} from "./GeneraSettings/GeneralSettings";
import {PoolList} from "./PoolList/PoolList";
import {DataContext} from "../../context/Data";
import {UserContext} from "../../context/WavesKeeper";
const Pools = () => {

    const {isLogin} = useContext(UserContext);
    const { isLoadingData, hasError, fetchData } = useContext(DataContext);

    useEffect(() => {
        isLogin && !isLoadingData && fetchData && fetchData();
    }, [fetchData, isLogin]);

    return <Container fluid className={"h-100 align-items-center justify-content-center"} style={{minWidth: 500}}>
        <LoadingError isLoadingError={hasError}/>
        <GeneralSettings/>
        <hr className={"w-auto mx-2"} hidden={isLoadingData}/>
        <PoolList/>
    </Container>
};

export default Pools;