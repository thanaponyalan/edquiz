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
    const {recordForEdit, toggle, choices}=props;

    const validate=(fieldValues=values)=>{
        let temp={...errors}
        // if('objective' in fieldValues)
        //     temp.objective=fieldValues.objective?"":"This field is required"        
        // if('bloomLevel' in fieldValues)
        //     temp.bloomLevel=fieldValues.bloomLevel?"":"This field is required"
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
                    <img src="/upload/5fafa7393e953fa2512c3db7/questions.png" width="100%"/>
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
