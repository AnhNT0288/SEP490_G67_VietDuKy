import {Col, Container, Row} from "react-bootstrap";

export default function ManagementMenu(){
    return(
        <Container fluid className="p-0">
            <Row className="m-0">
                <Col className="sidebar bg-deep-red min-vh-100 p-3" style={{ backgroundColor: "#A31820" }}>
                    <img src="/Image/ListItem.svg" alt="Viet Du Ky" width={600} height={100} />
                    <ul className="list-unstyled" style={{ color: "white", listStyle: "none", padding: 0 }}>
                        <li className="mb-3 active"
                            style={{padding: "10px 15px", borderRadius: "8px", cursor: "pointer", transition: "background-color 0.3s ease",}}
                            onMouseEnter={(e) => {e.target.style.backgroundColor = "#f0f0f0";e.target.style.color = "black";}}
                            onMouseLeave={(e) => {e.target.style.backgroundColor = "transparent";e.target.style.color = "white";}}
                        >
                            Quản lý Tour
                        </li>

                        <li className="mb-3"
                            style={{padding: "10px 15px", borderRadius: "8px", cursor: "pointer", transition: "background-color 0.3s ease",}}
                            onMouseEnter={(e) => {e.target.style.backgroundColor = "#f0f0f0";e.target.style.color = "black";}}
                            onMouseLeave={(e) => {e.target.style.backgroundColor = "transparent";e.target.style.color = "white";}}
                        >
                            Lorem Ipsum
                        </li>
                        <li className="mb-3">Lorem Ipsum</li>
                        <li className="mb-3">Lorem Ipsum</li>
                        <li className="mb-3">Lorem Ipsum</li>
                        <li className="mb-3">Lorem Ipsum</li>
                        <li className="mb-3">Lorem Ipsum</li>
                        <li className="mb-3">Thêm</li>
                    </ul>
                </Col>
            </Row>
        </Container>
    )
}