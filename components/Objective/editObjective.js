import React, { useState, useEffect } from 'react'
import { Button, Grid, TextField,  } from "@material-ui/core";
import {useForm, Form} from "../MaterialUI/useForm";
import Controls from "../MaterialUI/controls/Controls";
import Popup from '../MaterialUI/Popup';

const initialValues = {
    _id: '',
    objective: '',
    bloomLevel: ''
}


export default function editObjectiveForm(props) {
    const {updateOrInsertObj, recordForEdit, toggle, courseId, openDialog, setOpenDialog, title}=props;

    const validate=(fieldValues=values)=>{
        let temp={...errors}
        if('objective' in fieldValues)
            temp.objective=fieldValues.objective?"":"This field is required"        
        if('bloomLevel' in fieldValues)
            temp.bloomLevel=fieldValues.bloomLevel?"":"This field is required"
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
            updateOrInsertObj({...values, courseId: courseId})
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

    const bloom=[
        {id: 1, title: 'Remember'},
        {id: 2, title: 'Understand'},
        {id: 3, title: 'Apply'},
        {id: 4, title: 'Analyze'},
        {id: 5, title: 'Evaluate'},
        {id: 6, title: 'Create'}
    ]

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
                    <Grid item xs={12}>
                        <Controls.Input
                            label="Objective"
                            name="objective"
                            value={values.objective}
                            onChange={handleInputChange}
                            error={errors.objective}
                        />
                        <Controls.Select
                            name="bloomLevel"
                            label="Bloom's Taxonomy"
                            value={values.bloomLevel}
                            onChange={handleInputChange}
                            options={bloom}
                            error={errors.bloomLevel}
                        />
                    </Grid>
                </Grid>
            </Form>
        </Popup>
    )
}
