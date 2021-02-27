import MainLayout from "../containers/app/mainLayout";
import { Component } from 'react';
import { compose } from "recompose";
import { roleSelected, withAuthSync } from "../utils/auth";
import { withRouter } from "next/router";
import { Card, CardImg, CardBody, CardTitle, CardText, Row, Col, CardFooter } from "reactstrap";
import ExamSet from "../components/Test";

class Test extends Component{
    render(){
        console.log('Test');
        console.log(this.props);
        return(
            <MainLayout>
                <div className="container-fluid">
                    <Row>
                        <ExamSet name="Unit1" subject="IAS" qCount={12}/>
                        <ExamSet name="Unit1" subject="OS" qCount={8}/>
                    </Row>
                </div>
            </MainLayout>
        )
    }
}

export default compose(
    withAuthSync,
    roleSelected,
    withRouter
)(Test);