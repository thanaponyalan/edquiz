import React, { useState, useEffect } from 'react'
import Controls from "../MaterialUI/controls/Controls";
import { Add, AddPhotoAlternate, Close as CloseIcon } from "@material-ui/icons";
import { Dialog, AppBar, Toolbar, IconButton, Button, Grid, Input, Chip, makeStyles, Divider, Card, CardActionArea, Typography, CardContent, CardMedia, CardActions, FormLabel, FormControl, Radio, RadioGroup, FormControlLabel, FormHelperText } from "@material-ui/core";
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
    media: {
        height: 0,
        paddingTop: '56.25%'
    },
    addImg: {
        position: 'absolute',
        top: '50%',
        left: '50%'
    },
    card: {
        margin: '8px',
        width: '100%'
    },
    formControlLabel: {
        width: '100%',
        '& span:nth-of-type(2)': {
            width: '100%'
        }
    }
}));

const initialValues = {
    question: {
        type: 0,
        title: '',
        pict: ''
    },
    choices: [
        {
            isTrue: true,
            choice: '',
            pict: ''
        },
        {
            isTrue: false,
            choice: '',
            pict: ''
        },
        {
            isTrue: false,
            choice: '',
            pict: ''
        },
        {
            isTrue: false,
            choice: '',
            pict: ''
        }
    ],
    params: {
        a: 0,
        b: 0,
        c: 0
    },
    quiz: { id: -1, title: 'Not In Test' },
    course: { id: -1, title: 'No Course Selected' },
    objectives: []
}

const AddQuestion = (props) => {
    const { openDialog, title, setOpenDialog, courses, quizzes, handleSave, insertNew, recordForEdit } = props;
    const [disabledCourse,setDisabledCourse]=useState(false);
    
    const courseOptions=courses.map((item,i)=>{
        return {id: item._id, title: item.courseName}
    })
    const quizOptions=quizzes.map(item=>{
        return {id: item._id, title: item.quizName}
    })
    const [objectiveOptions, setObjectiveOptions]=useState([]);
    const classes = useStyles();
    const handleChangeType = (qType) => {
        setValues({
            ...values,
            question: {
                ...values.question, type: qType
            }
        })
    }

    const handleClose = () => {
        setOpenDialog(false)
        // setValues(initialValues)
        setObjectiveOptions([])
        setDisabledCourse(false)
    }

    const clearImage = (idx = null) => {
        if (idx != null) {
            setChoices(choices.map((item, i) => {
                return { ...item, pict: idx == i ? '' : item.pict }
            }))
        } else {
            setValues({
                ...values,
                question: {
                    ...values.question, pict: ''
                }
            })
        }
    }

    const validate=(fieldValues=values)=>{
        let temp={...errors}
        if('question' in fieldValues)
            temp.question=fieldValues.question.title?"":"This field is required"        
        if('course' in fieldValues)
            temp.course=fieldValues.course.id!=-1?"":"Course must be selected"
        if('objectives' in fieldValues)
            temp.objectives=fieldValues.objectives.length?"":"At least one objective required";
        if('choices' in fieldValues)
            temp.choices=fieldValues.choices.filter(choice=>choice.choice=='').length<3&&fieldValues.choices.filter(choice=>{return choice.isTrue&&choice.choice}).length>0?"":"At least two choices required";
        setErrors({
            ...temp
        })
        if(fieldValues==values)
            return Object.values(temp).every(x=>x=="");
    }

    const {
        values,
        setValues,
        errors,
        setErrors,
        handleInputChange,
        handleInputOptionChange
    } = useForm(initialValues,true,validate)

    const [quiz, setQuiz] = useState(values.quiz);
    const [course, setCourse] = useState(values.course)
    const [objectives, setObjectives] = useState(values.objectives)
    const [choices, setChoices] = useState(values.choices)

    useEffect(() => {
        console.log(recordForEdit);
        if(recordForEdit!=null&&recordForEdit!=undefined){
            setValues({
                ...recordForEdit
            })
            setObjectiveOptions(courses.filter(course=>course._id==recordForEdit.course.id)[0].objectives.map((item,idx)=>{
                return {id: item._id, title: item.objective}
            }));
        }
    }, [recordForEdit])

    useEffect(() => {
        setValues({
            ...values,
            quiz,
            course,
            objectives
        })
    }, [quiz,course,objectives]);

    useEffect(() => {
        setValues({
            ...values,
            choices
        });
        validate({choices:choices});
    }, [choices])

    useEffect(() => {
        if (values.quiz != quiz) setQuiz(values.quiz)
        if (values.course != course) setCourse(values.course);
        if (values.objectives != objectives) setObjectives(values.objectives);
        if (values.choices != choices) setChoices(values.choices);
    }, [values])

    const getForm = (questionType) => {
        const Forms = [<MultipleChoice validate={validate} errors={errors} values={values} choices={choices} setChoices={setChoices} handleInputChange={handleInputChange} imageHandler={imageHandler} clearImage={clearImage} />, <Match />, <TrueOrFalse />]
        return Forms[questionType];
    }

    const handle = () => {
        if(validate()){
            handleSave(values)
            setValues(initialValues);
        }
    }

    const imageHandler = (event) => {
        console.log(event.target.id);
        const imageInput = event.target.id.split('_')
        const reader = new FileReader();
        reader.onload = () => {
            if (reader.readyState === 2) {
                if (imageInput.length > 1) {
                    const idx = imageInput[1];
                    setChoices(choices.map((item, i) => {
                        return { ...item, pict: i == idx ? reader.result : item.pict }
                    }))
                } else {
                    setValues({
                        ...values,
                        question: {
                            ...values.question, pict: reader.result
                        }
                    });
                }
            }
        }
        reader.readAsDataURL(event.target.files[0])
    }

    return (
        <Popup open={openDialog} handleClose={handleClose} fullScreen handleSave={handle} title={title}>
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
                            id="testSelector-quiz.title"
                            value={values.quiz}
                            handleInputChange={(event, newValue) => {
                                if (!newValue) {
                                    setQuiz({
                                        title: 'Not In Test',
                                        id: -1
                                    })
                                    setDisabledCourse(false);
                                    setCourse({
                                        id: -1,
                                        title: 'No Course Selected'
                                    })
                                    setObjectives([])
                                    setObjectiveOptions([])
                                } else if (newValue.inputValue) {
                                    setQuiz({
                                        title: newValue.inputValue,
                                        id: 0
                                    })
                                } else {
                                    setQuiz({
                                        ...newValue
                                    })
                                    if(newValue.id==-1){
                                        setDisabledCourse(false);
                                        setCourse({
                                            id: -1,
                                            title: 'No Course Selected'
                                        })
                                        setObjectives([])
                                        setObjectiveOptions([])
                                    }else{
                                        const {_id, courseName}=quizzes.filter(quiz=>quiz._id==newValue.id)[0].courseId;
                                        setCourse({id: _id, title: courseName})
                                        setDisabledCourse(true)
                                        setObjectiveOptions(courses.filter(course=>course._id==_id)[0].objectives.map((item,idx)=>{
                                            return {id: item._id, title: item.objective}
                                        }));
                                    }
                                }
                            }}
                            options={[{ id: -1, title: 'Not In Test' }, ...quizOptions]}
                            freeSolo
                            createAble
                        />
                        <Controls.AutoComplete
                            error={errors.course}
                            disabled={disabledCourse}
                            name="course"
                            label="Course"
                            id="courseSelector-course.title"
                            value={values.course}
                            handleInputChange={(event, newValue) => {
                                if (!newValue) {
                                    setCourse({
                                        id: -1,
                                        title: 'No Course Selected'
                                    })
                                    setObjectives([])
                                    setObjectiveOptions([])
                                } else {
                                    setCourse({
                                        ...newValue
                                    })
                                    validate({course: newValue})
                                    if(newValue.id==-1){
                                        setObjectives([])
                                        setObjectiveOptions([])
                                    }else{
                                        setObjectiveOptions(courses.filter(course=>course._id==newValue.id)[0].objectives.map((item,idx)=>{
                                            return {id: item._id, title: item.objective}
                                        }));
                                    }
                                }
                            }}
                            options={[{id: -1, title: 'No Course Selected'}, ...courseOptions]}
                            freeSolo={false}
                        />
                        <Controls.AutoComplete
                            error={errors.objectives}
                            multiple
                            name="objectives"
                            label="Objectives"
                            id="objectivesSelector-objectives.title"
                            value={objectives}
                            handleInputChange={(event, newValue) => {
                                setObjectives([
                                    ...newValue
                                ])
                                validate({objectives:[...newValue]})
                            }}
                            options={objectiveOptions}
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
                <Card className={classes.fullHeightCard} variant="outlined" style={values.question.type == idx ? { backgroundColor: '#3f51b5', color: 'white' } : {}}>
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
    const { values, handleInputChange, imageHandler, clearImage, choices, setChoices, errors, validate } = props;
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
                error={errors.question}
            />
            <Card className={classes.card}>
                <CardActionArea component="label" htmlFor="uploadQuestionImage">
                    <CardMedia
                        className={classes.media}
                        image={values.question.pict}
                        style={{ backgroundSize: 'contain' }}
                    >
                    </CardMedia>
                    {!values.question.pict && <AddPhotoAlternate className={classes.addImg} />}
                </CardActionArea>
                <CardActions>
                    <Button onClick={clearImage} size="small" color="primary" style={{ marginLeft: 'auto' }}>Clear Image</Button>
                </CardActions>
            </Card>
            <FormControl variant="outlined" {...errors.choices&&{error:true}}>
                <FormLabel>Choices</FormLabel>
                {errors.choices&&<FormHelperText>{errors.choices}</FormHelperText>}
                <RadioGroup
                    onChange={(e) => {
                        setChoices(choices.map((item, i) => {
                            return { ...item, isTrue: i == e.target.value }
                        }))
                    }}
                >
                    <Grid container spacing={3}>
                        {
                            choices.map((item, i) =>
                                <Grid item xs={12} sm={6} key={i}>
                                    <FormControlLabel className={classes.formControlLabel} value={i} control={<Radio />} label={<Controls.Input label={`Choice ${i+1}`} name={`choice_${i}`} value={item.choice} onChange={(e) => {
                                        setChoices(choices.map((item, i) => {
                                            return { ...item, choice: i == e.target.name.split('_')[1] ? e.target.value : item.choice }
                                        }))
                                    }} />} checked={item.isTrue} />
                                    <Card className={classes.card}>
                                        <CardActionArea component="label" htmlFor={`choiceImg_${i}`}>
                                            <CardMedia
                                                className={classes.media}
                                                image={item.pict}
                                                style={{ backgroundSize: 'contain' }}
                                            >
                                            </CardMedia>
                                            {!item.pict && <AddPhotoAlternate className={classes.addImg} />}
                                        </CardActionArea>
                                        <CardActions>
                                            <Button onClick={() => clearImage(i)} size="small" color="primary" style={{ marginLeft: 'auto' }}>Clear Image</Button>
                                        </CardActions>
                                    </Card>
                                </Grid>
                            )
                        }
                    </Grid>
                </RadioGroup>
            </FormControl>
            <input
                type="file"
                id="uploadQuestionImage"
                style={{ display: 'none' }}
                onChange={imageHandler}
            />
            <input
                type="file"
                id="choiceImg_0"
                style={{ display: 'none' }}
                onChange={imageHandler}
            />
            <input
                type="file"
                id="choiceImg_1"
                style={{ display: 'none' }}
                onChange={imageHandler}
            />
            <input
                type="file"
                id="choiceImg_2"
                style={{ display: 'none' }}
                onChange={imageHandler}
            />
            <input
                type="file"
                id="choiceImg_3"
                style={{ display: 'none' }}
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
