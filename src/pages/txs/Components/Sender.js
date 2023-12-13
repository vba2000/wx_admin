import {Col, Container, Row} from "react-bootstrap";


export const Sender = ({ senderData, setSederData, ...props }) => {

    return <Container {...props}>
        <Row>
            <Col>Sender Pub Key</Col><Col>{senderData?.senderPublicKey || ''}</Col>
            <Col>Sender Address</Col><Col>{senderData?.sender || ''}</Col>
        </Row>
    </Container>
};