import {Col, Container, Image, Row} from "react-bootstrap";
import {useContext} from "react";
import {LoadingError} from "./LoadingError";
import {GeneralSettings} from "./GeneraSettings/GeneralSettings";
import {PoolList} from "./PoolList/PoolList";
import {DataContext} from "../../context/Data";

const Pools = () => {
    const {isLoadingData, hasError} = useContext(DataContext);

    return <Container fluid className={"align-items-center justify-content-center"} style={{minWidth: 500}}>
        <LoadingError isLoadingError={hasError}/>
        <Row className={"text-center w-100 align-content-center"} hidden={!isLoadingData}>
            <Col>
                <Image className={"w-25 rounded-circle"} src={"https://media.tenor.com/iCB4R4H96BwAAAAC/cat-sit.gif"}/>
            </Col>
        </Row>
        <GeneralSettings/>
        <hr className={"mx-2"} hidden={isLoadingData}/>
        <PoolList/>
    </Container>
};

export default Pools;