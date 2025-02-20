// import React, { useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {useState} from "react";

export default function AddNewTourPage (){
    const [show, setShow] = useState(false);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    return (
        <>
            {/* Nút mở modal */}
            <Button style={{backgroundColor:"#A31820", border: "1px solid #E0E0E0", borderRadius: "8px", boxShadow: "0 0 5px rgba(0, 0, 0, 0.1)",}}
                onClick={() => setShow(true)}
                onMouseEnter={(e) => (e.target.style.backgroundColor = "red")}
                onMouseLeave={(e) => (e.target.style.backgroundColor = "#A31820")}>
                Thêm Tour mới
            </Button>

            {/* Modal */}
            <Modal show={show} onHide={() => setShow(false)} centered >
                <Modal.Header closeButton>
                    <Modal.Title>Thêm Travel Tour</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        {/* Chọn Tour */}
                        <Form.Group className="mb-3">
                            <Form.Label><span style={{ color: "red" }}>*</span> Tour</Form.Label><br/>
                            <Form.Select style={{ border: "1px solid #CFD3DB", borderRadius: "4px", boxShadow: "0 0 5px rgba(0, 0, 0, 0.1)",width:"100%", height:"40px"}}>
                                <option>Chọn Tour</option>
                            </Form.Select>
                        </Form.Group>

                        {/* Ngày khởi hành - Ngày về */}
                        <Row className="align-items-end">
                            <Col md={5}>
                                <Form.Group className="mb-3">
                                    <Form.Label><span style={{ color: "red"}}>*</span> Ngày khởi hành</Form.Label>
                                    <DatePicker
                                        selected={startDate}
                                        onChange={(date) => setStartDate(date)}
                                        className="form-control"
                                        placeholderText="Chọn ngày khởi hành"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={2} className="d-flex justify-content-center align-items-start">
                                <span style={{ fontSize: "20px" }}>→</span>
                            </Col>
                            <Col md={5}>
                                <Form.Group className="mb-3">
                                    <Form.Label><span style={{ color: "red" }}>*</span> Ngày về</Form.Label>
                                    <DatePicker
                                        selected={endDate}
                                        onChange={(date) => setEndDate(date)}
                                        className="form-control"
                                        placeholderText="Chọn ngày về"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        {/* Số lượng người */}
                        <Form.Group className="mb-3">
                            <Form.Label><span style={{ color: "red" }}>*</span> Số lượng người</Form.Label>
                            <Form.Control type="number" placeholder="Nhập số lượng người" />
                        </Form.Group>

                        {/* Giá Travel Tour */}
                        <Form.Group className="mb-3">
                            <Form.Label><span style={{ color: "red" }}>*</span> Giá Travel Tour</Form.Label>
                            <Form.Control type="text" placeholder="Nhập giá Travel Tour" />
                        </Form.Group>
                    </Form>
                </Modal.Body>

                {/* Footer Buttons */}
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShow(false)}>
                        Hủy
                    </Button>
                    <Button style={{ backgroundColor: "#A31820", border: "none" }}>
                        Tạo mới
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

