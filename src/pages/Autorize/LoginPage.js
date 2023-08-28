import {Alert, Tab, Tabs, Container, Button, Row} from "react-bootstrap";
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

    return <Container className={"d-flex h-100"}>
        <Alert variant="primary" className={"align-self-center m-5"}>
            <Alert.Heading>Login to continue</Alert.Heading>
            <p>
                Use <a target="_blank" href='https://keeper-wallet.app/' className="m-0">Waves Keeper</a> for login.
            </p>
            <hr/>
            <Row className="mb-0 d-flex justify-content-center">
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
            <Row>
                <Button onClick={onLogin}>Login</Button>
            </Row>
        </Alert>
    </Container>;
}