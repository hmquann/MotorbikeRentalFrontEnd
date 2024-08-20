import { CircularProgress } from "@mui/material";
import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

const PopUpConfirm = ({ show, message, onConfirm, onCancel }) => {
  return (
    <div>
      <Modal show={show} onHide={onCancel} centered>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div dangerouslySetInnerHTML={{ __html: message }} />
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            className="transition hover:scale-105"
            onClick={onCancel}
          >
            Hủy bỏ
          </Button>
          <Button
            variant="primary"
            className="transition hover:scale-105"
            onClick={onConfirm}
          >
            Xác nhận
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PopUpConfirm;
