import {Col, Row} from "react-bootstrap";


export const StringStatCom = ({value, valueName, children, ...props}) => {
    return <Col {...props}>
        <Row><small className="label label-primary text-nowrap">{valueName}</small></Row>
        <Row><small className="text-muted">{value}</small></Row>
        {children}
    </Col>
}