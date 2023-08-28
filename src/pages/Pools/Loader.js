import {Container, Spinner} from "react-bootstrap";


export const Loader = (params) => {
    if (params.isLoading === false) {
        return null;
    }

    return <Container fluid className="text-center m-lg-5 h-100"><Spinner /></Container>;
}