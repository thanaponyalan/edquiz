import MainLayout from "../containers/app/mainLayout";
import { Component } from 'react';
import { compose } from "recompose";
import { withAuthSync } from "../utils/auth";
import { withRouter } from "next/router";
import Question from "../components/Question";

class Item extends Component{
    render(){
        console.log('Item');
        console.log(this.props);
        return(
            <MainLayout title="Items">
                <Question id={1} type="Multiple Choice" question="What is the main purpose of exams?" params="Params: a=1, b=0.5, c=-1"/>
                <Question id={1} type="Multiple Choice" question="What is the main purpose of exams?" params="Params: a=1, b=0.5, c=-1"/>
            </MainLayout>
        )
    }
}

export default compose(
    withAuthSync,
    withRouter
)(Item);