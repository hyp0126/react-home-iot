import { Navbar, Nav } from 'react-bootstrap';

function Navigation() {
    return (
        <Navbar bg="light" expand="lg">
        <Navbar.Brand href="/">React-Bootstrap</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
            <Nav.Link href="/">Gauge</Nav.Link>
            <Nav.Link href="#chart">Chart</Nav.Link>
            <Nav.Link href="#login">Log in</Nav.Link>
            <Nav.Link href="#logout">Log out</Nav.Link>
            </Nav>
        </Navbar.Collapse>
        </Navbar>
    );
}


export default Navigation;