import {InputGroup, Form, Button} from "react-bootstrap";



export const CustomInput = ({ fieldName, value, ...props }) => {


    return <InputGroup {...props}>
        <Button  variant="secondary" style={{ width: '160px' }}  disabled={true}>{fieldName}</Button>
        <Form.Control
            placeholder="base58 public key"
            aria-label="base58 public key"
            aria-describedby="basic-addon1"
            value={value}
            disabled={true}
        />
        <InputGroup.Text className={'bg-success'}>Valid</InputGroup.Text>
    </InputGroup>
};
