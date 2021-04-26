import React, { useState, useEffect } from 'react'
import MainLayout from '../containers/app/mainLayout'
import { withRouter } from 'next/router';
import { withAuthSync } from '../utils/auth';
import { compose } from 'recompose';
import CourseWidget from '../components/Course';
import Controls from "../components/MaterialUI/controls/Controls";
import { Add } from '@material-ui/icons';
import CourseForm from "../components/Course/editCourse";
import { fetchCourse } from '../redux/actions/courseAction';
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { withToastManager } from 'react-toast-notifications';
import { _error_handler } from '../utils/errorHandler';
import {API} from '../constant/ENV'
import Loader from 'react-loader-spinner';
import { Grid } from '@material-ui/core';

const Course=(props)=>{
    const [openDialog,setOpenDialog]=useState(false);
    const [renderingCourse, setRenderingCourse]=useState([])

    const insertCourse=async(course)=>{
        course.owner=props.uid;
        delete course._id;
        props.toastManager.add("Creating...",{appearance: 'info', autoDismiss: true})
        try{
            const url=`${API}/course`
            const result=await fetch(url,{
                method: 'POST',
                headers:{
                    authorization: course.owner
                },
                body: JSON.stringify(course)
            });
            const res=await result.json();
            if(res.statusCode==200||res.statusCode==204){
                props.toastManager.add("Created",{appearance:'success', autoDismiss:true}, ()=>setOpenDialog(false));
                props.fetchCourse(res.data.payload.owner)
            }
        }catch(err){
            _error_handler(null,err,null);
            console.log(err);
        }
    }

    const addCourse=
        <li className="nav-item">
            <Controls.Fab
                onClick={()=>setOpenDialog(true)}
                title="Add Course"
                placement="left-start">
                <Add/>
            </Controls.Fab>
        </li>
    
    useEffect(()=>{
        props.fetchCourse(props.uid)
    },[])

    useEffect(()=>{
        if(props.courses){
            setRenderingCourse(props.courses.map((course,idx)=>({course: course, isExpand: !idx})))
        }
    },[props.courses])

    const handleClick=(idx)=>{
        const temp=renderingCourse.map(course=>({...course, isExpand: false}))
        temp[idx].isExpand=!renderingCourse[idx].isExpand
        setRenderingCourse(temp)
    }

    return (
        <>
            <MainLayout title="Courses and Objectives" pageActions={addCourse}>
                {renderingCourse?
                <Grid container spacing={2}>
                    {
                        renderingCourse.length>0&&renderingCourse.map((item,i)=>(
                            <Grid item xs={12}>
                                <CourseWidget key={i} courseDetail={item} onClick={()=>handleClick(i)}/>
                            </Grid>
                        ))
                    }
                </Grid>
                :
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
            <CourseForm
                title="Add Course"
                updateOrInsertCourse={insertCourse}
                toggle={()=>setOpenDialog(false)}
                openDialog={openDialog}
                setOpenDialog={setOpenDialog}
                />
        </>
    )
}

const mapDispatchToProps=dispatch=>{
    return{
        fetchCourse: bindActionCreators(fetchCourse, dispatch),
    }
}

const mapStateToProps=state=>{
    return{
        uid: state.authReducer.uid,
        courses: state.courseReducer.courses
    }
}

export default compose(
    connect(mapStateToProps,mapDispatchToProps),
    withAuthSync,
    withRouter,
    withToastManager,
)(Course);
