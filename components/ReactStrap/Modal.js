import React from 'react'
import { Modal as ReactStrapModal, ModalBody, ModalHeader } from "reactstrap";

export default function Modal(props) {
    const {openModal,setOpenModal,title,children}=props;
    const toggle=()=>{
        setOpenModal(!openModal)
    }
    return (
        <ReactStrapModal isOpen={openModal} toggle={toggle} size='lg'>
            <ModalHeader toggle={toggle}>{title}</ModalHeader>
            <ModalBody>
                {children}
            </ModalBody>
        </ReactStrapModal>
    )
}
