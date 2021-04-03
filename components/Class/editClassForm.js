import { Grid } from '@material-ui/core';
import React, { useEffect } from 'react'
import Controls from '../MaterialUI/controls/Controls';
import { Form, useForm } from '../MaterialUI/useForm';

const initialValues={
    _id: '',
    className: '',
    courseId: '',
    gClassName: ''
}

export default function editClassForm(props) {
    const {handleSave, recordForEdit, handleClose, courses}=props;

    const validate=(fieldValues=values)=>{
        let temp={...errors}
        if('className' in fieldValues)
            temp.className=fieldValues.className?"":"This field is required"        
        if('courseId' in fieldValues)
            temp.courseId=fieldValues.courseId?"":"This field is required"
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
            handleSave({...values})
            // console.log({...values, courseId: courseId});
            // console.log(courseId);
        }
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
                        label="Class Name"
                        name="className"
                        value={values.className}
                        onChange={handleInputChange}
                        error={errors.className}
                    />
                    <Controls.Input
                        label="Google Classroom Name"
                        name="gClassName"
                        value={values.gClassName}
                        onChange={handleInputChange}
                        disabled={true}
                    />
                    <Controls.Select
                        name="courseId"
                        label="Course"
                        value={values.courseId}
                        onChange={handleInputChange}
                        options={courses}
                        error={errors.courseId}
                    />
                </Grid>
            </Grid>
            <div>
                <Controls.Button text="Submit" type="submit"/>
                <Controls.Button text="Cancel" color="default" onClick={handleClose}/>
            </div>
        </Form>
    )
}
