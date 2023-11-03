import {useContext} from "react";
import {DataContext} from "../../context/Data";
import {Col, Container, Row} from "react-bootstrap";
import {LoadingError} from "../../components/LoadingError";
import {ImageLoader} from "../../components/ImageLoader";
import {AssetList} from "./AssetsList/AssetList";


const Assets = () => {
    const {isLoadingData, hasError} = useContext(DataContext);

    return <Container fluid className={"align-items-center justify-content-center"} style={{minWidth: 500}}>
        <LoadingError isLoadingError={hasError}/>
        <Row className={"text-center w-100 align-content-center"} hidden={!isLoadingData}>
            <Col className={"h-50 m-5 p-5"}>
                <ImageLoader height={200} hidden={!isLoadingData}/>
            </Col>
        </Row>
        <hr className={"mx-2"} hidden={isLoadingData}/>
        <AssetList/>
    </Container>
};

export default Assets;