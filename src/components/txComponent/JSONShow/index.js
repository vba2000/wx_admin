import { Form } from 'react-bootstrap';


export const JSONShow = ({ json, ...props }) => {



    return <Form.Control
        type="text"
        as={'textarea'}
        rows={10}
        value={JSON.stringify(json, null, 4)}
        {...props}
    />

};