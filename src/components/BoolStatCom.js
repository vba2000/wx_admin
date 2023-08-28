import {Col, Row} from "react-bootstrap";


const boolToString = (isActive) => isActive ? <small className="text-bg-success rounded px-2">Enable</small> :
    <small className="text-bg-danger rounded px-2">Disable</small>;
export const BoolStatCom = ({ value, valueName, children, ...props }) => {
    return <Col {...props}>
        <Row><small className="lab}el label-primary text-nowrap">{valueName}</small></Row>
        <Row><small className="text-muted">{boolToString(value)}</small></Row>
        {children}
    </Col>
}