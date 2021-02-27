import React, { useState } from 'react'
import MainLayout from '../containers/app/mainLayout'
import { withRouter } from 'next/router';
import { roleSelected, withAuthSync } from '../utils/auth';
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
import { wrapper } from "../redux/store";
import { withInitialCourses } from '../utils/initialProps';

const courseDetails=[
    {
        _id: "1111",
        courseName: "Course 1",
        courseNo: "03300000",
        courseDescription: "",
        objectives:[
            { _id:1, objective: "Can ...", bloomLevel: "1" },
            { _id:2, objective: "Explain ...", bloomLevel: "2"},
            { _id:3, objective: "Can ...", bloomLevel: "1" },
            { _id:4, objective: "Explain ...", bloomLevel: "2"},
            { _id:5, objective: "Can ...", bloomLevel: "1" },
            { _id:6, objective: "Explain ...", bloomLevel: "2"},
            { _id:7, objective: "Can ...", bloomLevel: "1" },
            { _id:8, objective: "Explain ...", bloomLevel: "2"}
        ]
    },{
        _id: "2222",
        courseName: "Course 2",
        courseNo: "03300001",
        objectives:[
            { _id:1, objective: "Can ...", bloomLevel: "1" },
            { _id:2, objective: "Explain ...", bloomLevel: "2"}
        ]
    }
]


const Course=(props)=>{
    const {courses}=props;
    const [openModal,setOpenModal]=useState(false);
    const addOrEdit=(course)=>{
        // console.log(course);
    }
    // props.fetchCourse(props.uid,null);
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
                        courses.length>0&&courses.map((item,i)=>(
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
        courses: state.courseReducer
    }
}

export default compose(
    // connect(mapStateToProps,mapDispatchToProps),
    withAuthSync,
    roleSelected,
    withInitialCourses,
    withRouter,
    withToastManager,
)(Course);
