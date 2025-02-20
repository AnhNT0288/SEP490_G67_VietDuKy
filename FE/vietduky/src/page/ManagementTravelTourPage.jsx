import {Button, Col, Container, Form, InputGroup, Row, Table} from "react-bootstrap";
import {FaEllipsisV, FaSearch} from "react-icons/fa";
import 'bootstrap/dist/css/bootstrap.min.css';
import DatePicker from "react-datepicker";
import {useState} from "react";
import "react-datepicker/dist/react-datepicker.css";
import AddNewTourPage from "./AddNewTourPage.jsx";
import ManagementMenu from "../components/Management/Menu.jsx";

export default function ManagementTravelTourPage(){

    const [selectedDate, setSelectedDate] = useState(null);

    return(
        <Container fluid className="p-0">
            <Row className="m-0">

                <Col md={2} style={{padding:"0"}}>
                    <ManagementMenu/>
                </Col>

                {/* Main Content */}
                <Col md={10} className="p-4 main-content">
                    <h5 className="fw-bold page-title" style={{color:"gray", marginBottom:"40px"}} >Quản lý > Quản lý Travel Tour</h5>

                    <Row className="align-items-center mb-3">
                        <Col md={4}>
                            <InputGroup>
                                <Form.Control type="text" placeholder="Tìm kiếm bằng từ khóa" className="search-bar" style={{ border: "1px solid #E0E0E0", borderRadius: "4px", boxShadow: "0 0 5px rgba(0, 0, 0, 0.1)",}}/>
                                <Button variant="outline-secondary" style={{ border: "1px solid #E0E0E0", borderRadius: "4px", boxShadow: "0 0 5px rgba(0, 0, 0, 0.1)",}}>
                                    <FaSearch />
                                </Button>
                            </InputGroup>
                        </Col>
                        <Col md={2}>
                            <DatePicker
                                selected={selectedDate}
                                onChange={(date) => setSelectedDate(date)}
                                dateFormat="dd/MM/yyyy"
                                placeholderText="--/--/----"
                                className="filter-dropdown form-control"
                                style={{ border: "1px solid #E0E0E0", borderRadius: "4px", boxShadow: "0 0 5px rgba(0, 0, 0, 0.1)",}}
                            />
                        </Col>
                        <Col md={2}>
                            <Form.Select className="filter-dropdown" style={{border: "1px solid #E0E0E0", borderRadius: "8px", padding: "5px 16px", fontSize: "16px", color: "#000", backgroundColor: "#fff", boxShadow: "0 0 5px rgba(0, 0, 0, 0.1)", position: "relative"}}>
                                <option>Tour</option>
                            </Form.Select>
                        </Col>
                        <Col md={2}>
                            <Form.Select className="filter-dropdown" style={{ border: "1px solid #E0E0E0", borderRadius: "8px", padding: "5px 16px", boxShadow: "0 0 5px rgba(0, 0, 0, 0.1)",}}>
                                <option>Giá Travel Tour</option>
                            </Form.Select>
                        </Col>
                        <Col md={2} className="text-end">
                            <AddNewTourPage/>
                        </Col>
                    </Row>

                    {/* Tour Table */}
                    <Table striped hover className="tour-table bg-white shadow-sm">
                        <thead>
                        <tr>
                            <th>Tên Tour</th>
                            <th>Ngày khởi hành</th>
                            <th>Ngày về</th>
                            <th>Số lượng người</th>
                            <th>Giá Travel Tour</th>
                            <th>Thao tác</th>
                        </tr>
                        </thead>
                        <tbody>
                        {[1.52, 1.72, 1.61].map((price, index) => (
                            <tr key={index}>
                                <td>Du lịch Sapa</td>
                                <td>04/02/2025</td>
                                <td>06/02/2025</td>
                                <td>30</td>
                                <td>{price.toFixed(3)}.000 VNĐ</td>
                                <td><FaEllipsisV /></td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </Container>
    )
}