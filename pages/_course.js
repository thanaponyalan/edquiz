import MainLayout from "../containers/app/mainLayout";
import { Component } from 'react';
import { compose } from "recompose";
import { roleSelected, withAuthSync } from "../utils/auth";
import { withRouter } from "next/router";
import CourseWidget from "../components/Course";
import NewCourse from "../components/Course/newCourse";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Form, FormGroup, Input, Label, Row, Col } from "reactstrap";
import CourseForm from "../components/Course/editCourse";
import { Paper, makeStyles } from "@material-ui/core";

const useStyles=makeStyles(theme=>({
    pageContent:{
        margin: theme.spacing(5),
        padding: theme.spacing(3)
    }
}))

const addCourse=
    <li className="nav-item">
        <NewCourse/>
    </li>

class Course extends Component{
    
    courseDetails=[
        {
            courseName: "Course 1",
            courseNo: "03300000",
            objectives:[
                { no:1, obj: "Can ...", bloomLevel: "1" },
                { no:2, obj: "Explain ...", bloomLevel: "2"}
            ]
        },{
            courseName: "Course 2",
            courseNo: "03300001",
            objectives:[
                { no:1, obj: "Can ...", bloomLevel: "1" },
                { no:2, obj: "Explain ...", bloomLevel: "2"}
            ]
        }
    ]
    render(){
        classes=useStyles();
        console.log('Course');
        console.log(this.courseDetails);
        console.log(this.props);
        return(
            <MainLayout title="Courses and Objectives" pageActions={addCourse}>
                <Paper className={classes.pageContent}>
                    <CourseForm/>
                </Paper>
            </MainLayout>
        )
    }
}

export default compose(
    withAuthSync,
    roleSelected,
    withRouter
)(Course);