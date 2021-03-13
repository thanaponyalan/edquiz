import React, { useState, useEffect } from 'react'
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, FormGroup, Input, Label, Row, Col } from "reactstrap";
import { Grid, TextField,  } from "@material-ui/core";
import {useForm, Form} from "../MaterialUI/useForm";
import Controls from "../MaterialUI/controls/Controls";

const initialValues = {
    question:"",
    choice:""
}


export default function questionDetail(props) {
    const {recordForEdit, toggle, choices, question}=props;

    const validate=(fieldValues=values)=>{
        let temp={...errors}
        if('question' in fieldValues)
            temp.question=fieldValues.question?"":"This field is required"        
        if('choice' in fieldValues)
            temp.choice=fieldValues.choice?"":"This field is required"
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
            // updateOrInsertObj({...values, courseId: courseId})
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
                        label="Question"
                        name="question"
                        value={values.question}
                        onChange={handleInputChange}
                        error={errors.question}
                        inputProps={{readOnly: true}}
                    />
                    <img src={question.pict} width="100%"/>
                    <Controls.Radio
                        name="choice"
                        label="Choices"
                        value={values.choice}
                        onChange={handleInputChange}
                        options={choices}
                        error={errors.choice}
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
