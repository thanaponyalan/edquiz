import React, { useEffect } from 'react'
import { connect } from "react-redux";
import { withToastManager } from "react-toast-notifications";
import { compose } from "redux";
import Popup from "../MaterialUI/Popup";
import { _error_handler } from "../../utils/errorHandler";
import { bindActionCreators } from "redux";
import { Paper, makeStyles, TableBody, TableRow, TableCell, Toolbar, InputAdornment, Card, CardMedia, CardContent, Typography, CardActions, Grid, Button, IconButton, CardActionArea, CardHeader, Menu, MenuItem, Chip, Avatar, List, ListItem, ListItemText, ListItemSecondaryAction, ListItemIcon, Checkbox } from "@material-ui/core";
import { fetchClass } from "../../redux/actions/classAction";
import { useState } from "react";
import { Class, Clear, MoreVert } from "@material-ui/icons";
import { API } from "../../constant/ENV";
import AssignPopup from '../Assignment/assignPopup';
import moment from "moment";
import { fetchQuestion } from '../../redux/actions/questionAction';
import { fetchTest } from '../../redux/actions/testAction';
import { Form } from '../MaterialUI/useForm';
import Controls from '../MaterialUI/controls/Controls';

const TestWidget=(props)=>{
    const [variant,setVariant]=useState("outlined")
    const [anchorEl,setAnchorEl]=useState(null);
    const [openDialog,setOpenDialog]=useState(false);
    const [openQuestionList,setOpenQuestionList]=useState(false)
    const {test,classes, availableQuestion}=props;
    const [questions, setQuestions]=useState(test.questionId)
    const [openAddQuestion, setOpenAddQuestion]=useState(false)
    const [selectedQuestion, setSelectedQuestion]=useState([])
    const [duplicateDialog, setDuplicateDialog]=useState(false)
    const [quizName, setQuizName]=useState('')
    const handleClose=()=>{
        setOpenDialog(false)
    }
    const handleSave=async(data)=>{
        props.toastManager.add("Assigning...",{appearance: 'info', autoDismiss: true})
        try{
            const url=`${API}/assignment`
            const result=await fetch(url,{
                method: 'POST',
                headers:{
                    authorization: props.uid
                },
                body: JSON.stringify(data)
            })
            const res=await result.json();
            if(res.statusCode==200||res.statusCode==204){
                props.toastManager.add("Assigned",{appearance:'success', autoDismiss:true}, ()=>setOpenDialog(false));
                props.fetchClass(props.uid,props.role,props.toastManager)
            }
        }catch(err){
            _error_handler(null,err,null);
            console.log(err);
        }
    }

    const removeQuestion=(idx)=>{
        setQuestions(questions.filter((question,i)=>idx!=i))
    }

    const handleCancelChanged=()=>{
        setQuestions(test.questionId)
        setOpenQuestionList(false)
    }

    const handleToggle=(question)=>{
        const currentIndex=selectedQuestion.findIndex(q=>q._id==question._id)
        const newSelectedQuestion=[...selectedQuestion]
        if(currentIndex==-1){
            newSelectedQuestion.push(question)
        }else{
            newSelectedQuestion.splice(currentIndex,1)
        }
        setSelectedQuestion(newSelectedQuestion)
    }

    const handleQuestionSelected=()=>{
        setQuestions([...questions,...selectedQuestion])
        setSelectedQuestion([])
        setOpenAddQuestion(false)
    }

    const handleCancelSelected=()=>{
        setOpenAddQuestion(false)
    }
    
    const handleSaveQuiz=async()=>{
        if(!questions.length){
            props.toastManager.add("At least one question required.",{appearance: 'error', autoDismiss: true})
            return
        }
        const data={
            questionId: questions.map(question=>question._id),
            _id: test._id,
            diff: test.questionId.filter(question=>!questions.some(q=>q._id==question._id)).map(question=>question._id)
        }
        
        props.toastManager.add("Updating...",{appearance: 'info', autoDismiss: true})
        try{
            const url=`${API}/test`
            const result=await fetch(url,{
                method: 'PUT',
                headers:{
                    authorization: props.uid
                },
                body: JSON.stringify(data)
            })
            const res=await result.json();
            if(res.statusCode==200||res.statusCode==204){
                props.toastManager.add("Updated",{appearance:'success', autoDismiss:true}, ()=>setOpenQuestionList(false));
                props.fetchTest(props.uid,props.toastManager)
                props.fetchQuestion(props.uid, props.toastManager)
            }
        }catch(err){
            _error_handler(null,err,null);
            console.log(err);
        }
    }

    const duplicateQuiz=async()=>{
        const newQuiz={
            courseId: test.courseId._id,
            quizName: quizName,
            questionId: test.questionId.map(question=>question._id),
            owner: test.owner
        }
        props.toastManager.add("Duplicating...",{appearance: 'info', autoDismiss: true})
        try{
            const url=`${API}/test`
            const result=await fetch(url,{
                method: 'POST',
                headers:{
                    authorization: props.uid
                },
                body: JSON.stringify(newQuiz)
            })
            const res=await result.json();
            if(res.statusCode==200||res.statusCode==204){
                props.toastManager.add("Duplicated",{appearance: 'success', autoDismiss: true})
                props.fetchTest(props.uid,props.toastManager)
                props.fetchQuestion(props.uid, props.toastManager)
            }
        }catch(err){
            _error_handler(null,err,null)
            console.log(err);
        }
    }

    return(
        <>
            <Card variant={variant} onMouseEnter={()=>{setVariant("elevation")}} onMouseLeave={()=>{setVariant('outlined')}} style={{cursor: "pointer"}}>
                <CardHeader
                    title={test.quizName}
                    subheader={
                        <Chip size="small" avatar={<Avatar><Class/></Avatar>}
                            label={test.courseId.courseName}
                        />
                    }
                    action={
                        <IconButton aria-controls="testMenus" onClick={(e)=>setAnchorEl(e.currentTarget)} aria-label="actions">
                            <MoreVert style={{color: 'white'}}/>
                        </IconButton>
                    }
                    style={{
                        backgroundColor: 'black',
                        color: 'white'
                    }}
                />
                <CardContent>
                    <Typography gutterBottom variant="body2">
                        <label>Items Amount :</label>
                        {` ${questions.length}`}
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button style={{marginLeft: 'auto', marginRight: 'auto'}} onClick={()=>setOpenDialog(true)}>assign</Button>
                    <Button style={{marginLeft: 'auto', marginRight: 'auto'}} onClick={()=>{setOpenQuestionList(true);}}>questions</Button>
                </CardActions>
            </Card>
            <Menu
                id="testMenus"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={()=>{
                    setAnchorEl(null)
                }}
            >
                <MenuItem onClick={()=>{setAnchorEl(null); setDuplicateDialog(true);}}>Duplicate</MenuItem>
            </Menu>
            <Popup maxWidth="sm" fullWidth open={duplicateDialog} handleClose={()=>setDuplicateDialog(false)} title="Enter Quiz Name" popupAction={
                <Button variant="contained" onClick={duplicateQuiz}>Duplicate</Button>
            }>
                <Form>
                    <Controls.Input
                        name="quizName"
                        label="Quiz Name"
                        value={quizName}
                        onChange={(e)=>{
                            setQuizName(e.target.value)
                        }}
                    />
                </Form>
            </Popup>
            <Popup maxWidth="sm" fullWidth={true} open={openDialog} handleClose={handleClose} title="Assign Test">
                {
                    <AssignPopup setOpenDialog={setOpenDialog} recordForEdit={{quizName: test.quizName, quizId: test._id, classId: '', scheduled: moment().format(), dueDate: moment(moment()).add(1,'days').format(), maxPoints: questions.length}} classes={classes.filter(item=>item.courseId._id==test.courseId._id).map((item)=>({id: item._id, title: item.className}))} handleClose={handleClose} handleSave={handleSave} />
                }
            </Popup>
            <Popup maxWidth="sm" fullWidth={true} open={openQuestionList} handleClose={handleCancelChanged} title="Questions" scroll="paper" popupAction={
                <>
                    <Button onClick={()=>setOpenAddQuestion(true)} style={{marginRight: 'auto'}}>
                        Add Question
                    </Button>
                    <Button onClick={handleCancelChanged}>
                        Cancel
                    </Button>
                    <Button onClick={handleSaveQuiz}>
                        Save
                    </Button>
                </>
            }>
                <List>
                    {
                        questions.length?questions.map((question,idx)=>
                            <ListItem key={idx} button>
                                <ListItemText primary={question.question.title}/>
                                <ListItemSecondaryAction>
                                    <IconButton edge="end" aria-label="remove" onClick={()=>removeQuestion(idx)}>
                                        <Clear/>
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                        )
                        :
                        <ListItem>
                            <ListItemText primary="There's no question in this quiz"/>
                        </ListItem>
                    }
                </List>
            </Popup>
            <Popup maxWidth="xs" fullWidth={true} open={openAddQuestion} handleClose={()=>setOpenAddQuestion(false)} title="Add Question" popupAction={
                <>
                    <Button onClick={handleCancelSelected}>
                        Cancel
                    </Button>
                    <Button onClick={handleQuestionSelected}>
                        Save
                    </Button>
                </>
            }>
                <List>
                    {
                        
                        availableQuestion.length?availableQuestion.map((question,idx)=>
                            <ListItem key={idx} button onClick={()=>handleToggle(question)}>
                                <ListItemIcon>
                                    <Checkbox
                                        checked={selectedQuestion.findIndex(q=>q._id==question._id)!==-1}
                                    />
                                </ListItemIcon>
                                <ListItemText primary={question.question.title}/>
                            </ListItem>
                        ):
                        <ListItem>
                            <ListItemText primary="There's no question available"/>
                        </ListItem>
                    }
                </List>
            </Popup>
        </>
    )
}

const mapDispatchToProps = dispatch => {
    return {
        fetchClass: bindActionCreators(fetchClass, dispatch),
        fetchQuestion: bindActionCreators(fetchQuestion, dispatch),
        fetchTest: bindActionCreators(fetchTest, dispatch)
    }
}

const mapStateToProps = state => {
    return {
        uid: state.authReducer.uid,
        role: state.authReducer.role,
        classes: state.classReducer.classes,
        storedQuestions: state.questionReducer.questions
    }
}

export default compose(
    connect(mapStateToProps,mapDispatchToProps),
    withToastManager
)(TestWidget)
