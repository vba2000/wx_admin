import {Alert, Tab, Tabs, Container, Button, Row, Col} from "react-bootstrap";
import {useCallback, useContext} from "react";
import {UserContext} from "../../context/WavesKeeper";
import {setMainnet, setTestnet} from "../../services";


export const LoginPage = () => {

    const {login} = useContext(UserContext);
    const onSelect = useCallback((event) => {
        if (event === 'testnet') {
            setTestnet();
        } else {
            setMainnet();
        }
    }, []);

    const onLogin = useCallback(() => {
        login();
    }, [login]);

    const onLoginGuest = useCallback(() => {
        login(true);
    }, [login]);

    return <Container fluid className={"align-content-center p-5"}>
        <Alert variant="primary" className={""}>
            <Alert.Heading>Login to continue</Alert.Heading>
            <p>
                Use <a target="_blank" href='https://keeper-wallet.app/' className="m-0">Waves Keeper</a> for login.
            </p>
            <hr/>
            <Row className="mb-0 justify-content-center">
                <Tabs
                    onSelect={onSelect}
                    defaultActiveKey="mainnet"
                    className="mb-2"
                    justify
                >
                    <Tab eventKey="mainnet" title="Mainnet">
                    </Tab>
                    <Tab eventKey="testnet" title="Testnet">
                    </Tab>
                </Tabs>
            </Row>
            <Row className={"d-flex justify-content-center"}>
                <Col md={2}>
                    <Button className={"w-100"}  onClick={onLogin}>Login</Button>
                </Col>
                <Col md={2}>
                    <Button className={"w-100"} onClick={onLoginGuest} variant={"secondary"}>Enter as Guest</Button>
                </Col>
            </Row>
        </Alert>
    </Container>;
}