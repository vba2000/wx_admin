import {Container, Alert, Button} from "react-bootstrap";
import {useContext} from "react";
import {DataContext} from "../context/Data";


export const LoadingError = (params) => {

    const { fetchData } = useContext(DataContext);


    if (params.isLoadingError === false) {
        return null;
    }

    return <Container fluid className="text-center my-5 h-100">
        <Alert variant="danger ">
            <Alert.Heading>Connection problems!</Alert.Heading>
            <Button onClick={fetchData}>Try again.</Button>
        </Alert>
    </Container>;
}