import { Modal, Button, Form} from "react-bootstrap";
import "react-datepicker/dist/react-datepicker.css";
import {useState} from "react";

export default function AddNewLocation(){
    const [show, setShow] = useState(false);
    const [locationName, setLocationName] = useState("");
    const [description, setDescription] = useState("");

    return (
        <>
            {/* Nút mở modal */}
            <Button style={{backgroundColor:"#A31820", border: "1px solid #E0E0E0", borderRadius: "8px", boxShadow: "0 0 5px rgba(0, 0, 0, 0.1)",}}
                    onClick={() => setShow(true)}
                    onMouseEnter={(e) => (e.target.style.backgroundColor = "red")}
                    onMouseLeave={(e) => (e.target.style.backgroundColor = "#A31820")}>
                Thêm địa điểm
            </Button>

            {/* Modal */}
            <Modal show={show} onHide={() => setShow(false)}  centered>
                <Modal.Header closeButton>
                    <Modal.Title className="fw-bold">Thêm địa điểm</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p className="text-muted">Quản trị viên thêm địa điểm cho Tour</p>
                    <Form>
                        {/* Tên địa điểm */}
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold">Tên địa điểm</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Nhập tên lớp"
                                value={locationName}
                                onChange={(e) => setLocationName(e.target.value)}
                            />
                        </Form.Group>

                        {/* Mô tả */}
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold">Mô tả</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Nhập mô tả"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="light" onClick={() => setShow(false)} className="btn-cancel">
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

