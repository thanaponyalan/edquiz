import MainLayout from "../containers/app/mainLayout";
import React, { useEffect, useState } from 'react'
import { compose } from "recompose";
import { withAuthSync } from "../utils/auth";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { fetchTest } from "../redux/actions/testAction";
import TestWidget from "../components/Test/TestWidget";
import { Button, Grid } from "@material-ui/core";
import Loader from "react-loader-spinner";
import { fetchClass } from "../redux/actions/classAction";
import { fetchQuestion } from "../redux/actions/questionAction";
import { Add } from "@material-ui/icons";
import Controls from "../components/MaterialUI/controls/Controls";
import Popup from "../components/MaterialUI/Popup";
import { Form } from "../components/MaterialUI/useForm";
import { fetchCourse } from "../redux/actions/courseAction";
import { withToastManager } from "react-toast-notifications";
import { API } from "../constant/ENV";
import { _error_handler } from "../utils/errorHandler";

const Tests=(props)=>{
    const [openModal, setOpenModal]=useState(false)
    const [quizName, setQuizName]=useState({value: '', error: ''})
    const [course, setCourse]=useState({id: '', error: ''})
    const addQuiz=
        <li className="nav-item">
            <Controls.Fab
                onClick={()=>setOpenModal(true)}
                title="Add Quiz"
                placement="left-start">
                <Add/>
            </Controls.Fab>
        </li>

    const validate=()=>{
        setQuizName({...quizName, error: quizName.value!=''?'':'This field is required'})
        setCourse({...course, error: course.id!=''?'':'Course must be selected'})
        return(quizName.value!=''&&course.id!='')
    }

    const insertQuiz=async()=>{
        if(validate()){
            const quiz={
                quizName: quizName.value,
                courseId: course.id,
                owner: props.uid
            }
            props.toastManager.add("Adding...",{appearance: 'info', autoDismiss: true})
            try{
                const url=`${API}/test`
                const result=await fetch(url,{
                    method: 'POST',
                    headers:{
                        authorization: props.uid
                    },
                    body: JSON.stringify(quiz)
                })
                const res=await result.json();
                if(res.statusCode==200||res.statusCode==204){
                    props.toastManager.add("Added",{appearance: 'success', autoDismiss: true},()=>setOpenModal(false))
                    props.fetchTest(props.uid,props.toastManager)
                    props.fetchQuestion(props.uid, props.toastManager)
                }
            }catch(err){
                _error_handler(null,err,null)
                console.log(err);
            }
        }
    }

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
        if(!props.courses){
            props.fetchCourse(props.uid)
        }
    },[])

    return (
        <MainLayout title="Tests" pageActions={addQuiz}>
            { props.tests&&props.classes&&props.questions&&props.courses?
            <>
                <Grid container spacing={3}>
                    {
                        props.tests&&props.tests.map((item,idx)=>
                        <Grid key={idx} item xs={12} sm={6} md={4}>
                            <TestWidget 
                                test={item} 
                                availableQuestion={
                                    props.questions
                                        .filter(question=>question.courseId._id==item.courseId._id)
                                        .filter(question=>!item.questionId.some(thisQuestion=>thisQuestion._id==question._id))
                                } />
                        </Grid>
                        )
                    }
                </Grid>
                <Popup maxWidth="sm" fullWidth open={openModal} handleClose={()=>setOpenModal(false)} title="Add Quiz" popupAction={
                    <Button variant="contained" onClick={insertQuiz}>Add</Button>
                }>
                    <Form>
                        <Controls.Input
                            name="quizName"
                            label="Quiz Name"
                            value={quizName.value}
                            onChange={(e)=>{
                                setQuizName({value: e.target.value, error: e.target.value!=''?'':'This field is required'})
                            }}
                            error={quizName.error}
                        />
                        <Controls.Select
                            name="course"
                            label="Course"
                            value={course.id}
                            options={props.courses.map(course=>({id: course._id, title: course.courseName}))}
                            onChange={(e)=>{
                                setCourse({id: e.target.value, error: e.target.value!=''?'':'Course must be selected'})
                            }}
                            error={course.error}
                        />
                    </Form>
                </Popup>
            </>:
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
        fetchQuestion: bindActionCreators(fetchQuestion, dispatch),
        fetchCourse: bindActionCreators(fetchCourse, dispatch)
    }
}

const mapStateToProps=state=>{
    return{
        tests: state.testReducer.tests,
        classes: state.classReducer.classes,
        questions: state.questionReducer.questions,
        courses: state.courseReducer.courses
    }
}


export default compose(
    connect(mapStateToProps,mapDispatchToProps),
    withAuthSync,
    withToastManager
)(Tests);