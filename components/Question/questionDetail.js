import React, { useState, useEffect } from 'react'
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, FormGroup, Label, Row, Col } from "reactstrap";
import { Grid, TextField, Input, Chip, makeStyles  } from "@material-ui/core";
import {useForm, Form} from "../MaterialUI/useForm";
import Controls from "../MaterialUI/controls/Controls";

const useStyles = makeStyles((theme) => ({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
      maxWidth: 300,
    },
    chips: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    chip: {
      margin: 2,
    },
    noLabel: {
      marginTop: theme.spacing(3),
    },
  }));

const initialValues = {
    question:"",
    choice:"",
    courses:['a','b'],
    objectives:['a','b'],
    params: ""
}
const opts=[
    {id: 1, title: ''}
]

export default function questionDetail(props) {
    const {recordForEdit, toggle, choices, question}=props;
    const classes=useStyles();

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

    // console.log(values);
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
                <Controls.Button text="Check Answer" type="submit"/>
                {/* <Controls.Button text="Cancel" color="default" onClick={toggle}/> */}
            </div>
            <hr/>
            <Grid container>
                <Grid item md={12}>
                    <Controls.Select
                        name="courses"
                        label="Courses"
                        value={values.courses}
                        onChange={handleInputChange}
                        options={opts}
                        error={errors.courses}
                        multiple
                        input={<Input/>}
                        renderValue={(selected) => (
                            <div className={classes.chips}>
                                {selected.map((value) => (
                                    <Chip key={value} label={value} className={classes.chip} />
                                ))}
                            </div>
                        )}
                        inputProps={{readOnly: true}}
                    />
                    <Controls.Select
                        name="objectives"
                        label="Objectives"
                        value={values.objectives}
                        onChange={handleInputChange}
                        options={opts}
                        error={errors.objectives}
                        multiple
                        input={<Input/>}
                        renderValue={(selected) => (
                            <div className={classes.chips}>
                                {selected.map((value) => (
                                    <Chip key={value} label={value} className={classes.chip} />
                                ))}
                            </div>
                        )}
                        inputProps={{readOnly: true}}
                    />
                    {/* <Controls.Input
                        name="params"
                        label="Parameters"
                        value={values.params}
                        onChange={handleInputChange}
                        error={errors.params}
                        inputProps={{readOnly: true}}
                    /> */}
                </Grid>

            </Grid>
        </Form>
    )
}
