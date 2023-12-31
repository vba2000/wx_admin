import {Container} from "react-bootstrap";
import {useContext, useEffect} from "react";
import {Loader} from "./Loader";
import {LoadingError} from "./LoadingError";
import {GeneralSettings} from "./GeneralSettings";
import {PoolList} from "./PoolList";
import {DataContext} from "../../context/Data";
const Pools = () => {

    const { isLoadingData, hasError } = useContext(DataContext);

    return <Container fluid className={"h-100 align-items-center justify-content-center"} style={{minWidth: 500}}>
        <Loader isLoading={isLoadingData}/>
        <LoadingError isLoadingError={hasError}/>
        <GeneralSettings/>
        <PoolList/>
    </Container>
};

export default Pools;