import {Alert, Tab, Tabs, Container, Button, Row, Col} from "react-bootstrap";
import {useCallback, useContext, useEffect, useState} from "react";
import {UserContext} from "../../context/WavesKeeper";
import {setMainnet, setTestnet} from "../../services";
import {useDataForRoot} from "../../context/Data";


export const LoginPage = () => {
    const [error, setError] = useState('');
    const {login} = useContext(UserContext);
    const onSelect = useCallback((event) => {
        if (event === 'testnet') {
            setTestnet();
        } else {
            setMainnet();
        }
    }, []);

    const onLogin = useCallback(() => {
        login().catch((e) => {
            setError(e.toString());
        });
    }, [login]);

    const onLoginGuest = useCallback(() => {
        setError('');
        login(true);
    }, [login]);

    return <Container className={""}>
        <Alert variant="secondary" className={"m-sm-5 p-sm-5"}>
            <p className={"text-nowrap text-center"}>
                <h1><span className="bi bi-tools"></span> WX Admin</h1>
            </p>
            <Row className="mb-0">
                <Tabs
                    onSelect={onSelect}
                    defaultActiveKey="mainnet"
                    className="mb-1"
                    variant={"pills"}
                >
                    <Tab eventKey="mainnet" title="Mainnet">
                    </Tab>
                    <Tab eventKey="testnet" title="Testnet">
                    </Tab>
                </Tabs>
            </Row>
            <hr/>
            <Row className={"d-flex justify-content-center p-2"}>
                <Col xl={2} lg={3} md={4} sm={5}>
                    <Button className={"w-100"} onClick={onLogin}>User Login</Button>
                </Col>
                <Col xl={2} lg={3} md={4} sm={5}>
                    <Button className={"w-100"} onClick={onLoginGuest} variant={"secondary"}>Guest Login</Button>
                </Col>
            </Row>
            <Alert variant={"danger"} hidden={!error}>
                {error}
            </Alert>
            <hr/>
            <small className={"text-muted"}>
                Login to continue.
                Use <a target="_blank" href='https://keeper-wallet.app/' className="m-0">Waves Keeper</a> for login.
            </small>
        </Alert>
    </Container>;
}