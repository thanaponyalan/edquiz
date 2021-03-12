import MainLayout from "../containers/app/mainLayout";
import { Component } from 'react';
import { compose } from "recompose";
import { withAuthSync } from "../utils/auth";
import { withRouter } from "next/router";

class Tests extends Component{
    render(){
        console.log('Tests');
        console.log(this.props);
        return(
            <MainLayout title="Tests">

            </MainLayout>
        )
    }
}

export default compose(
    withAuthSync,
    withRouter
)(Tests);