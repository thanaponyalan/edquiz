import React, { useState, useEffect } from 'react'
import Controls from "../MaterialUI/controls/Controls";
import { Add, AddPhotoAlternate, Close as CloseIcon } from "@material-ui/icons";
import { Dialog, AppBar, Toolbar, IconButton, Button, Grid, Input, Chip, makeStyles, Divider, Card, CardActionArea, Typography, CardContent, CardMedia, CardActions } from "@material-ui/core";
import { Form, useForm } from "../MaterialUI/useForm";
import Popup from "../MaterialUI/Popup";
import Fab from '../MaterialUI/controls/Fab';
const questionType = [
    "Multiple Choice",
    "Match",
    "True or False"
]

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
    fullHeightCard: {
        height: '100%'
    },
    media:{
        height: 0,
        paddingTop: '56.25%'
    },
    addImg:{
        position: 'absolute',
        top: '50%',
        left: '50%'
    }
}));

const initialValues={
    question:{
        type: 0,
        title: 'TEST5555',
        pict: ''
    },
    choices:[
        {
            isTrue: false,
            choice: 'Choice 1',
            pict: ''
        }
    ],
    params:{
        a: 0,
        b: 0,
        c: 0
    },
    test: {id: -1, title: 'Not In Test'},
    course: {id: -1, title: 'No Course Selected'},
    objectives:[{id: -1, title: 'Obj1'},{id:0, title: 'Obj2'}]
}

const AddQuestion = (props) => {
    const {openDialog, title, setOpenDialog}=props;
    const classes = useStyles();
    const handleChangeType = (qType) => {
        setValues({
            ...values,
            question:{
                ...values.question,type: qType
            }
        })
    }

    const handleClose=()=>{
        setOpenDialog(false)
        setValues(initialValues)
    }

    const clearImage=()=>{
        setValues({
            ...values,
            question:{
                ...values.question, pict: ''
            }
        })
    }

    const{
        values,
        setValues,
        errors,
        setErrors,
        handleInputChange,
        handleInputOptionChange
    }=useForm(initialValues)

    const [test,setTest]=useState(values.test);
    const [course,setCourse]=useState(values.course)
    const [objectives,setObjectives]=useState(values.objectives)

    useEffect(() => {
        setValues({
            ...values,
            test
        })
    }, [test]);

    useEffect(() => {
        setValues({
            ...values,
            course
        })
    }, [course])

    useEffect(() => {
        setValues({
            ...values,
            objectives
        })
    }, [objectives])

    const getForm = (questionType) => {
        const Forms = [<MultipleChoice values={values} handleInputChange={handleInputChange} imageHandler={imageHandler} clearImage={clearImage} />, <Match />, <TrueOrFalse />]
        return Forms[questionType];
    }

    const handleSave=()=>{
        console.log(values);
    }

    const imageHandler=(event)=>{
        const reader=new FileReader();
        reader.onload=()=>{
            if(reader.readyState===2){
                setValues({
                    ...values,
                    question:{
                        ...values.question,pict: reader.result
                    }
                });
            }
        }
        reader.readAsDataURL(event.target.files[0])
    }

    return (
        <Popup open={openDialog} handleClose={handleClose} fullScreen handleSave={handleSave} title={title}>
            <Form>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Grid container spacing={3}>
                            <TypeSelection values={values} handleChangeType={handleChangeType} />
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={9}>
                        {getForm(values.question.type)}
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <Controls.AutoComplete
                            name="test"
                            label="Test"
                            id="testSelector-test.title"
                            value={values.test}
                            handleInputChange={(event,newValue)=>{
                                if(!newValue){
                                    setTest({
                                        title: 'Not In Test',
                                        id: -1
                                    })
                                }else if(newValue.inputValue){
                                    setTest({
                                        ...newValue.inputValue,
                                        id: 0
                                    })
                                }else{
                                    setTest({
                                        ...newValue
                                    })
                                }
                            }}
                            options={[{id: -1, title: 'Not In Test'},{id: 'test', title:'Test for Wk1'}, {id: '12', title: 'Test for Wk2'}]}
                            freeSolo
                            createAble
                        />
                        <Controls.AutoComplete
                            name="course"
                            label="Course"
                            id="courseSelector-course.title"
                            value={values.course}
                            handleInputChange={(event,newValue)=>{
                                if(!newValue){
                                    setCourse({
                                        id: -1,
                                        title: 'No Course Selected'
                                    })
                                }else{
                                    setCourse({
                                        ...newValue
                                    })
                                }
                            }}
                            options={[{id: -1, title: 'No Course Selected'},{id: 'test', title:'Test for Wk1'}, {id: '12', title: 'Test for Wk2'}]}
                            freeSolo={false}
                        />
                        <Controls.AutoComplete
                            multiple
                            name="objectives"
                            label="Objectives"
                            id="objectivesSelector-objectives.title"
                            value={objectives}
                            handleInputChange={(event,newValue)=>{
                                setObjectives([
                                    ...newValue
                                ])                          
                            }}
                            options={[{id: -1, title: 'Obj1'},{id:0, title: 'Obj2'},{id: 'test', title:'Test for Wk1'}, {id: '12', title: 'Test for Wk2'}]}
                            freeSolo={false}

                        />
                    </Grid>
                </Grid>
            </Form>

        </Popup>
    )
}

const TypeSelection = (props) => {
    const { handleChangeType, values } = props;
    const classes = useStyles();
    return (
        questionType.map((item, idx) =>
            <Grid item xs={12} sm={12 / questionType.length} key={idx}>
                <Card className={classes.fullHeightCard} variant="outlined" style={values.question.type==idx?{backgroundColor: '#3f51b5', color: 'white'}:{}}>
                    <CardActionArea onClick={() => handleChangeType(idx)}>
                        <CardContent>
                            <Typography variant="h6" component="h6">
                                {item}
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Grid>
        )
    )
}

const MultipleChoice = (props) => {
    const {values, handleInputChange, imageHandler, clearImage}=props;
    const classes = useStyles();
    return (
        <>
            <Controls.Input
                label="Question : MultipleChoice"
                name="question.title"
                value={values.question.title}
                onChange={handleInputChange}
                multiline
                rows={4}
            />
            <Card>
                <CardActionArea component="label" htmlFor="uploadQuestionImage">
                    <CardMedia 
                        className={classes.media}
                        image={values.question.pict}
                        >
                    </CardMedia>
                    {!values.question.pict&&<AddPhotoAlternate className={classes.addImg}/>}
                </CardActionArea>
                <CardActions>
                    <Button onClick={clearImage} size="small" color="primary" style={{marginLeft: 'auto'}}>Clear Image</Button>
                </CardActions>
            </Card>
            <input
                type="file"
                id="uploadQuestionImage"
                style={{display:'none'}}
                onChange={imageHandler}
            />
        </>
    )
}

const Match = (props) => {
    const classes = useStyles()
    return (
        <Controls.Input
            label="Question : Matching"
            name="question"
            value="How long I've been doing this?"
        />
    )
}

const TrueOrFalse = (props) => {
    const classes = useStyles();
    return (
        <Controls.Input
            label="Question : TrueOrFalse"
            name="question"
            value="How long I've been doing this?"
        />
    )
}

export default AddQuestion;
