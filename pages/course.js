import React, { useState } from 'react'
import MainLayout from '../containers/app/mainLayout'
import { withRouter } from 'next/router';
import { withAuthSync } from '../utils/auth';
import { compose } from 'recompose';
import { Row } from 'reactstrap';
import CourseWidget from '../components/Course';
import Controls from "../components/MaterialUI/controls/Controls";
import { Add } from '@material-ui/icons';
import Modal from "../components/ReactStrap/Modal";
import CourseForm from "../components/Course/editCourse";
import { fetchCourse } from '../redux/actions/courseAction';
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { withToastManager } from 'react-toast-notifications';
import { _error_handler } from '../utils/errorHandler';

const Course=(props)=>{
    const [openModal,setOpenModal]=useState(false);

    const insertCourse=async(course)=>{
        course.owner=props.uid;
        delete course._id;
        props.toastManager.add("Creating...",{appearance: 'info', autoDismiss: true})
        try{
            const url=`http://localhost:3000/api/course`
            const result=await fetch(url,{
                method: 'POST',
                headers:{
                    authorization: course.owner
                },
                body: JSON.stringify(course)
            });
            const res=await result.json();
            if(res.statusCode==200||res.statusCode==204){
                props.toastManager.add("Created",{appearance:'success', autoDismiss:true}, ()=>setOpenModal(false));
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
                onClick={()=>setOpenModal(true)}>
                <Add/>
            </Controls.Fab>
        </li>
    
    
    return (
        <>
            <MainLayout title="Courses and Objectives" pageActions={addCourse}>
                <Row>
                    {
                        props.courses.length>0&&props.courses.map((item,i)=>(
                            <CourseWidget key={i} courseDetail={item} isCollapse={i} />
                        ))
                    }
                </Row>
            </MainLayout>
            <Modal
                openModal={openModal}
                setOpenModal={setOpenModal}
                title="Add Course">
                <CourseForm
                    updateOrInsertCourse={insertCourse}
                    toggle={()=>setOpenModal(false)}/>
            </Modal>
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
