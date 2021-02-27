import MainLayout from "../containers/app/mainLayout";
import { Component } from 'react';
import { compose } from "recompose";
import { withAuthSync } from "../utils/auth";
import { withRouter } from "next/router";

class Objective extends Component{
    render(){
        console.log('Objective');
        console.log(this.props);
        return(
            <MainLayout>

            </MainLayout>
        )
    }
}

export default compose(
    withAuthSync,
    withRouter
)(Objective);