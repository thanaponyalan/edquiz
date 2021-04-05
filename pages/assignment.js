import MainLayout from "../containers/app/mainLayout";
import React, { Component } from 'react';
import { compose } from "recompose";
import { withAuthSync } from "../utils/auth";
import { withRouter } from "next/router";
import { Table } from 'reactstrap';
import AssignmentWidget from "../components/Assignment/AssignmentWidget";
import { bindActionCreators } from "redux";
import { fetchAssignment } from "../redux/actions/assignmentAction";
import { connect } from "react-redux";
import { Grid } from "@material-ui/core";

const Assignment=(props)=>{
    const {assignments}=props
    return (
        <MainLayout title="Assignments">
            <Grid container spacing={3}>
                {
                    assignments&&assignments.map((item,idx)=>
                    <Grid key={idx} item xs={12} sm={3} md={4}>
                        <AssignmentWidget assignment={item} />
                    </Grid>
                    )
                }
            </Grid>
        </MainLayout>
    )
}

const mapStateToProps=state=>{
    return{
        uid: state.authReducer.uid,
        assignments: state.assignmentReducer.assignments
    }
}

const mapDispatchToProps=dispatch=>{
    return{
        fetchAssignment: bindActionCreators(fetchAssignment,dispatch)
    }
}


export default compose(
    connect(mapStateToProps,mapDispatchToProps),
    withAuthSync
)(Assignment);