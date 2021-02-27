import React, { Component } from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Form, FormGroup, Input, Label, Nav, NavItem, NavLink, TabContent, TabPane, Row, Col, Card, CardTitle, CardText } from "reactstrap";
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withToastManager } from 'react-toast-notifications';
import { _error_handler } from '../../utils/errorHandler';
import classnames from 'classnames';
import { Fab } from "@material-ui/core";
import { Add } from "@material-ui/icons";

class NewCourse extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            activeTab: '1'
        }
    }

    static async getInitialProps(ctx) {

    }

    toggle = () => {
        // if(!this.state.open){
        //     setTimeout(() => {
        //         this.setState({open:!this.state.open})
        //     }, 3000);
        // }else 
        this.setState({ open: !this.state.open })
    }

    fetch = async () => {
        this.props.fetchClassroom(this.props.uid, this.props.toastManager);
        this.props.toastManager.add("Fetching...", { appearance: 'success', autoDismiss: true }, this.toggle);
    }

    toggleTab = tab => {
        if (this.state.activeTab !== tab) this.setState({ activeTab: tab });
    }

    render() {
        // console.log("editCourse");
        // console.log(this.props);
        return (
            <>
                <Fab size="small" color="primary" aria-label="add" onClick={this.toggle}><Add/></Fab>
                {/* <button type="button" className="btn btn-tool" onClick={this.toggle}><i className="fas fa-pencil-alt"></i></button> */}
                <Modal isOpen={this.state.open} toggle={this.toggle} size='lg'>
                    <ModalHeader toggle={this.toggle}>Add new course</ModalHeader>
                    <ModalBody>
                        <div>
                            <Nav tabs>
                                <NavItem>
                                    <NavLink className={classnames({ active: this.state.activeTab === '1' })} onClick={() => { this.toggleTab('1'); }}>
                                        <a href="#">
                                            Course Detail
                                        </a>
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink className={classnames({ active: this.state.activeTab === '2' })} onClick={() => { this.toggleTab('2'); }}>
                                        <a href="#">
                                            Objectives
                                        </a>
                                    </NavLink>
                                </NavItem>
                            </Nav>
                            <TabContent activeTab={this.state.activeTab}>
                                <TabPane tabId="1">
                                    <Row>
                                        <Col sm="12">
                                            <Card body>
                                                <Form>
                                                    <FormGroup>
                                                        <Label for="courseName">Course Name</Label>
                                                        <Input type="text" id="courseName"></Input>
                                                    </FormGroup>
                                                    <FormGroup>
                                                        <Label for="courseNo">Course No.</Label>
                                                        <Input type="text" id="courseNo"></Input>
                                                    </FormGroup>
                                                    <FormGroup>
                                                        <Label for="description">Course Description</Label>
                                                        <Input type="textarea" id="description"></Input>
                                                    </FormGroup>
                                                </Form>
                                            </Card>
                                        </Col>
                                    </Row>
                                </TabPane>
                                <TabPane tabId="2">
                                    <Row>
                                        <Col sm="6">
                                            <Card body>
                                                <CardTitle>Special Title Treatment</CardTitle>
                                                <CardText>With supporting text below as a natural lead-in to additional content.</CardText>
                                                <Button>Go somewhere</Button>
                                            </Card>
                                        </Col>
                                        <Col sm="6">
                                            <Card body>
                                                <CardTitle>Special Title Treatment</CardTitle>
                                                <CardText>With supporting text below as a natural lead-in to additional content.</CardText>
                                                <Button>Go somewhere</Button>
                                            </Card>
                                        </Col>
                                    </Row>
                                </TabPane>
                            </TabContent>
                        </div>
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
)(NewCourse);