import {Col, Container, Row} from "react-bootstrap";
import {useContext} from "react";
import {LoadingError} from "./LoadingError";
import {GeneralSettings} from "./GeneraSettings/GeneralSettings";
import {PoolList} from "./PoolList/PoolList";
import {DataContext} from "../../context/Data";
import {ImageLoader} from "../../components/ImageLoader";

const Pools = () => {
    const {isLoadingData, hasError} = useContext(DataContext);

    return <Container fluid className={"align-items-center justify-content-center"} style={{minWidth: 500}}>
        <LoadingError isLoadingError={hasError}/>
        <Row className={"text-center w-100 align-content-center"} hidden={!isLoadingData}>
            <Col className={"h-50 m-5 p-5"}>
                <ImageLoader height={200} hidden={!isLoadingData}/>
            </Col>
        </Row>
        <GeneralSettings/>
        <hr className={"mx-2"} hidden={isLoadingData}/>
        <PoolList/>
    </Container>
};

export default Pools;