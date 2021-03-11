import React, { useState, useEffect } from 'react'
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, FormGroup, Input, Label, Row, Col } from "reactstrap";
import { Grid, TextField,  } from "@material-ui/core";
import {useForm, Form} from "../MaterialUI/useForm";
import Controls from "../MaterialUI/controls/Controls";

const initialValues = {
    _id: '',
    objective: '',
    bloomLevel: ''
}


export default function editObjectiveForm(props) {
    const {updateOrInsertObj, recordForEdit, toggle, courseId}=props;

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
        <Form onSubmit={handleSubmit}>
            <Grid container>
                <Grid item md={12}>
                    {values.id!=''?
                    <Controls.Input
                        label="#"
                        name="_id"
                        value={values.id}
                        onChange={handleInputChange}
                        error={errors.objective}
                        disabled={true}
                    />
                    :""}
                    <Controls.Input
                        label="Objective"
                        name="objective"
                        value={values.objective}
                        onChange={handleInputChange}
                        error={errors.objective}
                    />
                    {/* <Controls.Input
                        label="Bloom's Taxonomy"
                        name="bloomLevel"
                        value={values.bloomLevel}
                        onChange={handleInputChange}
                        error={errors.bloomLevel}
                    /> */}
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
            <div>
                <Controls.Button text="Submit" type="submit"/>
                <Controls.Button text="Cancel" color="default" onClick={toggle}/>
            </div>
        </Form>
    )
}
