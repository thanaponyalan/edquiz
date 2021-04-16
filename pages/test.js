import MainLayout from "../containers/app/mainLayout";
import React, { useEffect } from 'react'
import { compose } from "recompose";
import { withAuthSync } from "../utils/auth";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { fetchTest } from "../redux/actions/testAction";
import TestWidget from "../components/Test/TestWidget";
import { Grid } from "@material-ui/core";
import Loader from "react-loader-spinner";
import { fetchClass } from "../redux/actions/classAction";
import { fetchQuestion } from "../redux/actions/questionAction";

const Tests=(props)=>{

    useEffect(()=>{
        if(!props.tests){
            props.fetchTest(props.uid);
        }
        if(!props.classes){
            props.fetchClass(props.uid,props.role)
        }
        if(!props.questions){
            props.fetchQuestion(props.uid)
        }
    },[])

    return (
        <MainLayout title="Tests">
            { props.tests&&props.classes&&props.questions?
            <Grid container spacing={3}>
                {
                    props.tests&&props.tests.map((item,idx)=>
                    <Grid key={idx} item xs={12} sm={4} md={3}>
                        <TestWidget 
                            test={item} 
                            availableQuestion={
                                props.questions
                                    .filter(question=>question.courseId._id==item.courseId._id&&!question.quizId)
                                    .filter(question=>!item.questionId.some(thisQuestion=>thisQuestion._id==question._id))
                            } />
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

const mapDispatchToProps=dispatch=>{
    return{
        fetchTest: bindActionCreators(fetchTest, dispatch),
        fetchClass: bindActionCreators(fetchClass, dispatch),
        fetchQuestion: bindActionCreators(fetchQuestion, dispatch)
    }
}

const mapStateToProps=state=>{
    return{
        tests: state.testReducer.tests,
        classes: state.classReducer.classes,
        questions: state.questionReducer.questions
    }
}


export default compose(
    connect(mapStateToProps,mapDispatchToProps),
    withAuthSync
)(Tests);