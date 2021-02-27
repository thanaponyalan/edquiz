import React, { Component } from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Form, FormGroup, Input, Label, Row, Col } from "reactstrap";
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { withToastManager } from 'react-toast-notifications';
import { _error_handler } from '../../utils/errorHandler';

class Insight extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false
        }
    }

    static async getInitialProps(ctx) {

    }

    toggle = () => {
        this.setState({ open: !this.state.open })
    }

    render() {
        console.log("editCourse");
        console.log(this.props);
        return (
            <>
                <button type="button" className="btn btn-tool" onClick={this.toggle}><i className="far fa-eye"></i></button>
                <Modal isOpen={this.state.open} toggle={this.toggle} size='lg'>
                    <ModalHeader toggle={this.toggle}>Edit course</ModalHeader>
                    <ModalBody>
                        <Row>
                            <Col sm="12">
                                    <Form>
                                        <FormGroup>
                                            <Label for="courseName">Course Name</Label>
                                            <Input type="text" id="courseName"></Input>
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="courseNo">Course No</Label>
                                            <Input type="text" id="courseNo"></Input>
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="description">Course Description</Label>
                                            <Input type="textarea" id="description"></Input>
                                        </FormGroup>
                                    </Form>
                            </Col>
                        </Row>
                    </ModalBody>
                    <ModalFooter style={{ alignItems: 'stretch' }}>
                        <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                        <Button color="primary" onClick={() => { }}>Save</Button>
                    </ModalFooter>
                </Modal>
            </>
        )
    }
}

export default compose(
    connect(null, null),
    withToastManager
)(Insight);