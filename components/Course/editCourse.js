import React, { useState, useEffect } from 'react'
import { Button, Grid, TextField,  } from "@material-ui/core";
import {useForm, Form} from "../MaterialUI/useForm";
import Controls from "../MaterialUI/controls/Controls";
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withToastManager } from 'react-toast-notifications';
import { bindActionCreators } from 'redux';
import { _error_handler } from '../../utils/errorHandler';
import { fetchCourse } from '../../redux/actions/courseAction';
import Popup from '../MaterialUI/Popup';

const initialValues = {
    _id: '',
    courseName: '',
    courseNo: '',
    courseDescription: ''
}

const courseForm=(props)=>{
    const {updateOrInsertCourse, recordForEdit, toggle, title, openDialog, setOpenDialog}=props;

    const validate=(fieldValues=values)=>{
        let temp={...errors}
        if('courseName' in fieldValues)
            temp.courseName=fieldValues.courseName?"":"This field is required"        
        if('courseNo' in fieldValues)
            temp.courseNo=fieldValues.courseNo?"":"This field is required"
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
        if(validate()){
            updateOrInsertCourse(values)
        }
    }

    useEffect(()=>{
        if(recordForEdit!=null)
            setValues({
                ...recordForEdit
            })
    },[recordForEdit])

    return (
        <Popup maxWidth="sm" fullWidth title={title} open={openDialog} handleClose={()=>setOpenDialog(false)} popupAction={
            <>
                <Button type="submit" variant="outlined" onClick={handleSubmit} color="primary">Submit</Button>
                {' '}
                <Button onClick={toggle} variant="outlined" color="secondary">Cancel</Button>
            </>
        }>
            <Form>
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
            </Form>
        </Popup>
    )
}



export default compose(

)(courseForm)
