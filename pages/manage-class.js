import MainLayout from "../containers/app/mainLayout";
import { Component } from 'react';
import { compose } from "recompose";
import { roleSelected, withAuthSync } from "../utils/auth";
import { withRouter } from "next/router";

class ManageClass extends Component{
    render(){
        console.log('ManageClass');
        console.log(this.props);
        return(
            <MainLayout title="Classes">

            </MainLayout>
        )
    }
}

export default compose(
    withAuthSync,
    roleSelected,
    withRouter
)(ManageClass);