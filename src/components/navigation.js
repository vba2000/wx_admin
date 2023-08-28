import {Nav, Navbar, Container, Button} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import {UserContext} from "../context/WavesKeeper";
import {useContext} from 'react';

function Navigation() {
    const {login, logout, user, isLogin} = useContext(UserContext);
    return (
        <>
            <Navbar expand="lg" bg="dark" data-bs-theme="dark">
                <Container>
                    <Navbar.Brand>
                        WX Admin
                    </Navbar.Brand>

                    <Navbar.Toggle aria-controls="basic-navbar-nav"/>

                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link>
                                <Link to={'/pools'}>
                                    Pools
                                </Link>
                            </Nav.Link>
                            <Nav.Link>
                                <Link to={'/assets'}>
                                    Assets
                                </Link>
                            </Nav.Link>
                        </Nav>
                    </Navbar.Collapse>

                    <Navbar.Collapse className="justify-content-end">
                        <Navbar.Text className="p-4">
                            <small>
                                {user}
                            </small>
                        </Navbar.Text>
                        {isLogin ? <Navbar.Text>
                                <Button size="sm" onClick={logout}>Logout</Button>
                            </Navbar.Text> :
                            <Navbar.Text>
                                <Button onClick={login}>Login</Button>
                            </Navbar.Text>}
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    );
}

export default Navigation;
