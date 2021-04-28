import MainLayout from "../containers/app/mainLayout";
import React, { useEffect } from 'react';
import { withAuthSync } from "../utils/auth";
import AssignmentWidget from "../components/Assignment/AssignmentWidget";
import { bindActionCreators, compose } from "redux";
import { fetchAssignment, setAssignment } from "../redux/actions/assignmentAction";
import { connect } from "react-redux";
import { Grid } from "@material-ui/core";
import Loader from "react-loader-spinner";

const Assignment=(props)=>{
    useEffect(()=>{
        props.setAssignment({data:{payload: null}})
        props.fetchAssignment(props.uid,props.role)
    },[])
    
    return (
        <MainLayout title="Assignments">
            {props.assignments?
            <Grid container spacing={3}>
                {
                    props.assignments?.map((item,idx)=>{
                        if(item.courseWorkId)
                            return(
                                <Grid key={idx} item xs={12} md={4}>
                                    <AssignmentWidget assignment={item} />
                                </Grid>
                            )
                    })
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
        fetchAssignment: bindActionCreators(fetchAssignment,dispatch),
        setAssignment: bindActionCreators(setAssignment, dispatch)
    }
}


export default compose(
    connect(mapStateToProps,mapDispatchToProps),
    withAuthSync
)(Assignment);