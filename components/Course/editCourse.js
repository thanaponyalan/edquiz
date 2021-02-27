import React, { useState, useEffect } from 'react'
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, FormGroup, Input, Label, Row, Col } from "reactstrap";
import { Grid, TextField,  } from "@material-ui/core";
import {useForm, Form} from "../MaterialUI/useForm";
import Controls from "../MaterialUI/controls/Controls";

const initialValues = {
    _id: '',
    courseName: '',
    courseNo: '',
    courseDescription: ''
}


export default function courseForm(props) {
    const {addOrEdit, recordForEdit, toggle}=props;

    const validate=(fieldValues=values)=>{
        let temp={...errors}
        if('courseName' in fieldValues)
            temp.courseName=fieldValues.courseName?"":"This field is required"        
        if('courseNo' in fieldValues)
            temp.courseNo=fieldValues.courseNo?"":"This field is required"
        if('courseDescription' in fieldValues)
            temp.courseDescription=fieldValues.courseDescription?"":"This field is required"
        setErrors({
            ...temp
        })
        if(fieldValues==values)
            return Object.values(temp).every(x=>x=="");
    }
    const{
        values,
        setValues,
        errors,
        setErrors,
        handleInputChange
    }=useForm(initialValues,true,validate)


    const handleSubmit=e=>{
        e.preventDefault();
        if(validate())
            console.log(values);
    }

    useEffect(()=>{
        if(recordForEdit!=null)
            setValues({
                ...recordForEdit
            })
    },[recordForEdit])

    return (
        <Form onSubmit={handleSubmit}>
            <Grid container>
                <Grid item md={12}>
                    <Controls.Input
                        label="Course Name"
                        name="courseName"
                        value={values.courseName}
                        onChange={handleInputChange}
                        error={errors.courseName}
                    />
                    <Controls.Input
                        label="Course No"
                        name="courseNo"
                        value={values.courseNo}
                        onChange={handleInputChange}
                        error={errors.courseNo}
                    />
                    <Controls.Input
                        multiline
                        rows={4}
                        label="Course Description"
                        name="courseDescription"
                        value={values.courseDescription}
                        onChange={handleInputChange}
                        error={errors.courseDescription}
                    />
                </Grid>
            </Grid>
            <div>
                <Controls.Button text="Submit" type="submit"/>
                <Controls.Button text="Cancel" color="default" onClick={toggle}/>
            </div>
        </Form>
    )
}
