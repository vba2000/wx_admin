import {Col, Container, Nav, Row} from "react-bootstrap";
import {useContext} from "react";
import {DataContext} from "../../context/Data";
import {Link} from "react-router-dom";
import {ImageLoader} from "../../components/ImageLoader";


const Txs = ({...props}) => {

    const {isLoadingData} = useContext(DataContext);


    return <Container hidden={isLoadingData}>
        <Row className={"text-center w-100 align-content-center"} hidden={!isLoadingData}>
            <Col className={"h-50 m-5 p-5"}>
                <ImageLoader height={200} hidden={!isLoadingData}/>
            </Col>
        </Row>
        <Row>
            <Nav.Link>
                <Link to={'data'}>
                    Data Tx
                </Link>
            </Nav.Link>
            <Nav.Link>
                <Link to={'transfer'}>
                    Transfer Tx
                </Link>
            </Nav.Link>
            <Nav.Link>
                <Link to={'burn'}>
                    Burn Tx
                </Link>
            </Nav.Link>
            <Nav.Link>
                <Link to={'invoke'}>
                    Invoke Tx
                </Link>
            </Nav.Link>
        </Row>
    </Container>;
};

export default Txs;