import React, { useState, useEffect } from 'react'
import Controls from "../MaterialUI/controls/Controls";
import { Grid, makeStyles, Card, CardActionArea, Typography, CardContent } from "@material-ui/core";
import { Form, useForm } from "../MaterialUI/useForm";
import Popup from "../MaterialUI/Popup";
import QuestionParameters from './QuestionParameters';
import MultipleChoice from './MultipleChoice';

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
    id: 0,
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
        handleInputChange
    } = useForm(initialValues,true,validate)
    
    const [quiz, setQuiz] = useState(values.quiz);
    const [course, setCourse] = useState(values.course)
    const [objectives, setObjectives] = useState(values.objectives)
    const [choices, setChoices] = useState(values.choices)
    const [disabledCourse,setDisabledCourse]=useState(false);
    const [objectiveOptions, setObjectiveOptions]=useState([]);

    const { openDialog, title, setOpenDialog, courses, quizzes, handleSave, recordForEdit } = props;
    const courseOptions=courses.map((item,i)=>{
        return {id: item._id, title: item.courseName}
    })
    const quizOptions=quizzes.map(item=>{
        return {id: item._id, title: item.quizName}
    })

    useEffect(() => {
        if(recordForEdit!=null&&recordForEdit!=undefined){
            setValues({
                ...recordForEdit
            })
            setQuiz(recordForEdit.quiz)
            setCourse(recordForEdit.course)
            setObjectives(recordForEdit.objectives)
            setChoices(recordForEdit.choices)
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
            objectives,
            choices
        })
        if(choices.filter(item=>item.choice!='').length>0)validate({choices:choices});
    }, [quiz,course,objectives,choices]);

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
        setValues(initialValues)
        setQuiz(initialValues.quiz)
        setCourse(initialValues.course)
        setObjectives(initialValues.objectives)
        setChoices(initialValues.choices)
        setObjectiveOptions([])
        setDisabledCourse(false)
        setErrors({})
    }

    const imageHandler = (event) => {
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

    const getForm = (questionType) => {
        const Forms = [
            <MultipleChoice 
                validate={validate} 
                errors={errors} 
                values={values} 
                choices={choices} 
                setChoices={setChoices} 
                handleInputChange={handleInputChange} 
                imageHandler={imageHandler} 
                clearImage={clearImage} 
            />, 
            <Match />, 
            <TrueOrFalse />]
        return Forms[questionType];
    }

    const handleQuestionSave = () => {
        if(validate()){
            handleSave(values)
            setOpenDialog(false)
            setValues(initialValues)
            setQuiz(initialValues.quiz)
            setCourse(initialValues.course)
            setObjectives(initialValues.objectives)
            setChoices(initialValues.choices)
            setObjectiveOptions([])
            setDisabledCourse(false)
            setErrors({})
        }
    }

    return (
        <Popup open={openDialog} handleClose={handleClose} fullScreen handleSave={handleQuestionSave} title={title}>
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
                        <QuestionParameters
                            values={values}
                            setQuiz={setQuiz}
                            quizzes={quizzes}
                            quizOptions={quizOptions}
                            setCourse={setCourse}
                            courses={courses}
                            courseOptions={courseOptions}
                            disabledCourse={disabledCourse}
                            setDisabledCourse={setDisabledCourse}
                            objectives={objectives}
                            setObjectives={setObjectives}
                            objectiveOptions={objectiveOptions}
                            setObjectiveOptions={setObjectiveOptions}
                            errors={errors}
                            validate={validate}
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
