import {Col, Container, Row} from "react-bootstrap";
import {useContext} from "react";
import {LoadingError} from "../../components/LoadingError";
import {DataContext} from "../../context/Data";
import {ImageLoader} from "../../components/ImageLoader";
import {PoolStats} from "./PoolStats";

const Stats = () => {
    const {isLoadingData, hasError} = useContext(DataContext);

    return <Container fluid className={"align-items-center justify-content-center"} style={{minWidth: 500}}>
        <LoadingError isLoadingError={hasError}/>
        <Row className={"text-center w-100 align-content-center"} hidden={!isLoadingData}>
            <Col className={"h-50 m-5 p-5"}>
                <ImageLoader height={200} hidden={!isLoadingData}/>
            </Col>
        </Row>
        <PoolStats hidden={isLoadingData}/>
    </Container>
};

export default Stats;