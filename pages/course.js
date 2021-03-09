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


const Course=(props)=>{
    const [openModal,setOpenModal]=useState(false);
    const addOrEdit=(course)=>{
        // console.log(course);
    }
    // console.log(props);
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
                    addOrEdit={addOrEdit}
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
    connect(mapStateToProps,null),
    withAuthSync,
    withRouter,
    withToastManager,
)(Course);
