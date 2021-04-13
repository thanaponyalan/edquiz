import MainLayout from "../containers/app/mainLayout";
import React, { Component, useEffect } from 'react';
import { compose } from "recompose";
import { withAuthSync } from "../utils/auth";
import { withRouter } from "next/router";
import { Table } from 'reactstrap';
import AssignmentWidget from "../components/Assignment/AssignmentWidget";
import { bindActionCreators } from "redux";
import { fetchAssignment } from "../redux/actions/assignmentAction";
import { connect } from "react-redux";
import { Grid } from "@material-ui/core";
import Loader from "react-loader-spinner";

const Assignment=(props)=>{
    const {assignments}=props
    useEffect(()=>{
        if(!props.assignments){
            props.fetchAssignment(props.uid,props.role)
        }
    },[])
    console.log(props);
    return (
        <MainLayout title="Assignments">
            {props.assignments?
            <Grid container spacing={3}>
                {
                    props.assignments?.map((item,idx)=>
                    <Grid key={idx} item xs={12} md={4}>
                        <AssignmentWidget assignment={item} />
                    </Grid>
                    )
                }
            </Grid>:
            <div
                style={{
                    width: '100%',
                    height: '100',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                <Loader type="TailSpin" color="#2bad60" height="100" width="100"/>
            </div>
            }
        </MainLayout>
    )
}

const mapStateToProps=state=>{
    return{
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