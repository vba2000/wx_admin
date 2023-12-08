import {Navbar, Container, Button, Nav} from 'react-bootstrap';
import {NavigationUser} from "./NavigationUser";
import {Link} from "react-router-dom";

function Navigation() {
    return (
        <>
            <Navbar expand="sm" bg="dark" data-bs-theme="dark">
                <Container fluid className="">
                    <Navbar.Brand>
                        <Button className="bi bi-tools" disabled variant={"dark"} size={"lg"}></Button>
                        WX Admin
                    </Navbar.Brand>


                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link>
                                <Link to={'pools'}>
                                    Pools
                                </Link>
                            </Nav.Link>
                            <Nav.Link>
                                <Link to={'assets'}>
                                    Assets
                                </Link>
                            </Nav.Link>
                            <Nav.Link>
                                <Link to={'stats'}>
                                    Pool stats
                                </Link>
                            </Nav.Link>
                        </Nav>
                    </Navbar.Collapse>

                    <NavigationUser/>
                </Container>
            </Navbar>
        </>
    );
}

export default Navigation;
