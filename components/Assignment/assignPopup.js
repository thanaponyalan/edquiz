
import { Grid, TextField } from '@material-ui/core';
import React, { useEffect } from 'react'
import Controls from '../MaterialUI/controls/Controls';
import { Form, useForm } from '../MaterialUI/useForm';
import { DateTimePicker } from "@material-ui/pickers";
import moment from "moment";

const date=new Date();

const initialValues={
    classId: '',
    quizId: '',
    quizName: '',
    scheduled: date,
    dueDate: date.setDate(date.getDate()+1)
}

export default function assignPopup(props) {
    const {handleSave, recordForEdit, handleClose, classes, setOpenDialog}=props;
    const validate=(fieldValues=values)=>{
        let temp={...errors}
        if('classId' in fieldValues)
            temp.classId=fieldValues.classId?"":"This field is required"        
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
            setOpenDialog(false)
            handleSave({...values})
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
                        label="Quiz Name"
                        name="quizName"
                        value={values.quizName}
                        onChange={handleInputChange}
                        disabled={true}
                    />
                    <Controls.Select
                        name="classId"
                        label="Class"
                        value={values.classId}
                        onChange={handleInputChange}
                        options={classes}
                        error={errors.classId}
                    />
                    <DateTimePicker
                        inputVariant="outlined"
                        label="Post Scheduling"
                        value={values.scheduled}
                        onChange={(e)=>{
                            setValues({
                                ...values,
                                scheduled: moment(e).format()
                            })
                        }}
                    />
                    <DateTimePicker
                        inputVariant="outlined"
                        label="Due Date"
                        value={values.dueDate}
                        onChange={(e)=>{
                            setValues({
                                ...values,
                                dueDate: moment(e).format()
                            })
                        }}
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
