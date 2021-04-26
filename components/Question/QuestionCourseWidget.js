
import { compose } from "recompose";
import { connect } from "react-redux";
import { Add, ExpandMore } from "@material-ui/icons";
import { _error_handler } from "../../utils/errorHandler";
import { Button, Card, CardActions, CardContent, CardHeader, Chip, Collapse, Grid, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, makeStyles, List, ListSubheader, ListItem, Tooltip } from "@material-ui/core";
import clsx from "clsx";
import { bindActionCreators } from "redux";
import { fetchQuestion } from "../../redux/actions/questionAction";
import { Fragment, useEffect, useState } from "react";
import Popup from "../MaterialUI/Popup";
import Question from "./index";
import Controls from "../MaterialUI/controls/Controls";
import AddQuestion from "./AddQuestion";

const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: 345,
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    fab: {
        position: 'absolute',
        bottom: theme.spacing(2),
        right: theme.spacing(2),
        zIndex: '2'
    },
    extendedIcon: {
        marginRight: theme.spacing(1),
    },
}));

const RowCollapse = (props) => {
    const { name, value } = props;
    return (
        <TableRow>
            <TableCell component="th" scope="row">
                {name}
            </TableCell>
            <TableCell align="center">
                {value}
            </TableCell>
        </TableRow>
    )
}

const bloomLevel=[
    "Remember",
    "Understand",
    "Apply",
    "Analyze",
    "Evaluate",
    "Create"
]

const QuestionCourseWidget=(props)=>{
    const classes = useStyles();
    const { course, distinctCourses, setDistinctCourses, idx, insertQuestion } = props
    const [courseQuestions,setCourseQuestions]=useState([])
    const [openDialog, setOpenDialog]=useState(false);
    const [openQuestionDialog, setOpenQuestionDialog]=useState(false)
    const handleExpandClick = () => {
        let tempExpanded=distinctCourses.map(course=>({...course, isExpanded: false}))
        tempExpanded[idx].isExpanded=!distinctCourses[idx].isExpanded
        setDistinctCourses(tempExpanded)
    };
    useEffect(()=>{
        if(props.questions.length){
            setCourseQuestions(props.questions.filter(question=>question.courseId._id==course.id))
        }
    },[props.questions])

    const countBloom=(level,allObj=false)=>{
        let count=0;
        if(allObj){
            courseQuestions.map(question=>{
                question.objectiveId.map(objective=>{
                    if(objective.bloomLevel===level)count++;
                })
            })
        }else{
            courseQuestions.map(question=>{
                if(question.objectiveId.some(objective=>(objective.bloomLevel==level)))count++;
            })
        }
        return count;
    }


    return (
    <>
        <Grid item xs={12}>
            <Card>
                <CardHeader
                    title={course.title}
                    subheader={
                        <Chip label={`Total Questions : ${courseQuestions.length}`} />
                    }
                    style={{
                        backgroundColor: '#343a40',
                        color: 'white'
                    }}
                    action={
                        <IconButton
                            className={clsx(classes.expand, {
                                [classes.expandOpen]: course.isExpanded,
                            })}
                            onClick={handleExpandClick}
                            aria-expanded={course.isExpanded}
                            aria-label="show more"
                            style={{
                                color: 'white'
                            }}
                        >
                            <ExpandMore />
                        </IconButton>
                    }
                />
                <Collapse in={course.isExpanded} timeout="auto" unmountOnExit>
                    <CardContent>
                        <TableContainer>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell style={{fontWeight: '600'}}>Bloom's Taxonomy</TableCell>
                                        <TableCell align="center" style={{fontWeight: '600'}}>Questions Amount</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        bloomLevel.map((bloom,idx)=><RowCollapse key={idx} name={bloom} value={countBloom(idx+1)}/>)
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </CardContent>
                    <CardActions>
                        <Button style={{flexGrow: '1'}} onClick={()=>setOpenDialog(true)}>View All</Button>
                    </CardActions>
                </Collapse>
            </Card>
        </Grid>
        <Popup open={openDialog} handleClose={()=>setOpenDialog(false)} fullScreen title={course.title} bgColor="#343a40" popupAction={
            <Controls.Fab
                onClick={() => setOpenQuestionDialog(true)}
                title="Add Question">
                <Add/>
            </Controls.Fab>
        }>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <List subheader={<li/>}>
                        {
                            bloomLevel.map((bloom,idx)=>
                            countBloom(idx+1)?
                                <li key={bloom}>
                                    <ul>
                                        <ListSubheader>
                                            <Card>
                                                <CardHeader
                                                    title={`${bloom} (${countBloom(idx+1)})`}
                                                    style={{backgroundColor: 'rgb(119, 135, 149)', color: 'white'}}
                                                />
                                            </Card>        
                                        </ListSubheader>
                                        {
                                            courseQuestions.filter(question=>question.objectiveId.some(obj=>obj.bloomLevel==idx+1)).map((item,idx)=>
                                                <ListItem key={idx}>
                                                    <Question question={{ ...item }} courses={props.courses} quizzes={props.quizzes} />
                                                </ListItem>
                                            )
                                        }
                                    </ul>
                                </li>
                                :
                                <Fragment key={idx}></Fragment>
                            )
                        }
                    </List>
                </Grid>
            </Grid>
        </Popup>
        <AddQuestion openDialog={openQuestionDialog} setOpenDialog={setOpenQuestionDialog} title="Add Question" currentCourse={course} courses={props.courses} quizzes={props.quizzes} handleSave={insertQuestion} />
    </>
    )
}

const mapDispatchToProps = dispatch => {
    return {
        fetchQuestion: bindActionCreators(fetchQuestion, dispatch)
    }
}

const mapStateToProps = state => {
    return {
        questions: state.questionReducer.questions,
        courses: state.courseReducer.courses,
        quizzes: state.quizReducer.quizzes
    }
}

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
)(QuestionCourseWidget)
