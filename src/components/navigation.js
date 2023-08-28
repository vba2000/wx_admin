import {Navbar, Container, Button} from 'react-bootstrap';
import {NavigationUser} from "./NavigationUser";

function Navigation() {
    return (
        <>
            <Navbar expand="lg" bg="dark" data-bs-theme="dark">
                <Container>
                    <Navbar.Brand>
                        <Button className="bi bi-tools" disabled variant={"dark"} size={"lg"}></Button>
                        WX Admin
                    </Navbar.Brand>

                    <Navbar.Toggle aria-controls="basic-navbar-nav"/>

                    {/*<Navbar.Collapse id="basic-navbar-nav">*/}
                    {/*    <Nav className="me-auto">*/}
                    {/*        <Nav.Link>*/}
                    {/*            <Link to={'/pools'}>*/}
                    {/*                Pools*/}
                    {/*            </Link>*/}
                    {/*        </Nav.Link>*/}
                    {/*        <Nav.Link>*/}
                    {/*            <Link to={'/assets'}>*/}
                    {/*                Assets*/}
                    {/*            </Link>*/}
                    {/*        </Nav.Link>*/}
                    {/*    </Nav>*/}
                    {/*</Navbar.Collapse>*/}

                    <NavigationUser/>
                </Container>
            </Navbar>
        </>
    );
}

export default Navigation;
