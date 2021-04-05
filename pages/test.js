import MainLayout from "../containers/app/mainLayout";
import React from 'react'
import { compose } from "recompose";
import { withAuthSync } from "../utils/auth";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { fetchTest } from "../redux/actions/testAction";
import TestWidget from "../components/Test/TestWidget";
import { Grid } from "@material-ui/core";

const Tests=(props)=>{
    const {tests}=props;
    console.log(tests);
    return (
        <MainLayout title="Tests">
            <Grid container spacing={3}>
                {
                    tests&&tests.map((item,idx)=>
                    <Grid key={idx} item xs={12} sm={4} md={3}>
                        <TestWidget test={item} />
                    </Grid>
                    )
                }
            </Grid>
        </MainLayout>
    )
}

const mapDispatchToProps=dispatch=>{
    return{
        fetchTest: bindActionCreators(fetchTest, dispatch)
    }
}

const mapStateToProps=state=>{
    return{
        uid: state.authReducer.uid,
        tests: state.testReducer.tests
    }
}


export default compose(
    connect(mapStateToProps,mapDispatchToProps),
    withAuthSync
)(Tests);