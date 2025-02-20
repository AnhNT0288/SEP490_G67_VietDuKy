import {Button, Col, Container, Form, InputGroup, Row, Table} from "react-bootstrap";
import {FaEllipsisH, FaEllipsisV, FaSearch} from "react-icons/fa";
import 'bootstrap/dist/css/bootstrap.min.css';
import DatePicker from "react-datepicker";
import {useState} from "react";
import "react-datepicker/dist/react-datepicker.css";
import AddNewTourPage from "./AddNewLocation.jsx";
import ManagementMenu from "../components/Management/Menu.jsx";

export default function ManagementLocationPage(){

    const [selectedDate, setSelectedDate] = useState(null);

    return(
        <Container fluid className="p-0">
            <Row className="m-0" >

                <Col md={2} style={{padding:"0"}}>
                    <ManagementMenu/>
                </Col>

                {/* Main Content */}
                <Col md={10} className="p-4 main-content">
                    <h5 className="fw-bold page-title" style={{color:"gray", marginBottom:"40px"}} >Quản lý > Quản lý địa điểm</h5>

                    <Row className="align-items-center mb-3 justify-content-between">
                        <Col md={4}>
                            <InputGroup>
                                <Form.Control type="text" placeholder="Tìm kiếm bằng từ khóa" className="search-bar" style={{ border: "1px solid #E0E0E0", borderRadius: "4px", boxShadow: "0 0 5px rgba(0, 0, 0, 0.1)",}}/>
                                <Button variant="outline-secondary" style={{ border: "1px solid #E0E0E0", borderRadius: "4px", boxShadow: "0 0 5px rgba(0, 0, 0, 0.1)",}}>
                                    <FaSearch />
                                </Button>
                            </InputGroup>
                        </Col>
                        <Col md={2} className="ms-auto text-end">
                            <AddNewTourPage/>
                        </Col>
                    </Row>

                    {/* Tour Table */}
                    <Table striped hover className="tour-table bg-white shadow-sm w-100">
                        <thead>
                        <tr>
                            <th className="text-start">Tên địa điểm</th>
                            <th className="text-start">Mô tả địa điểm</th>
                            <th className="text-end" style={{ width: "1%", whiteSpace: "nowrap" }}>Thao tác</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td className="text-start">Hà Nội</td>
                            <td className="text-start">Lorem Ipsum is dabet isum</td>
                            <td className="text-end" style={{ paddingRight: "10px" }}>
                                <FaEllipsisH />
                            </td>
                        </tr>
                        <tr>
                            <td className="text-start">Hải Phòng</td>
                            <td className="text-start">Lorem Ipsum is dabet isum</td>
                            <td className="text-end" style={{ paddingRight: "10px" }}>
                                <FaEllipsisH />
                            </td>
                        </tr>
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </Container>
    )
}