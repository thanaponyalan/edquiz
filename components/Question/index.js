import { useState } from "react";
import { connect } from "react-redux";
import { withToastManager } from "react-toast-notifications";
import { bindActionCreators, compose } from "redux";
import { API } from "../../constant/ENV";
import { fetchQuestion } from "../../redux/actions/questionAction";
import { fetchQuiz } from "../../redux/actions/quizAction";
import Card from "../MaterialUI/Card";
import ViewQuestion from "./AddQuestion";
import { Menu, MenuItem, Button, Grid } from "@material-ui/core";
import Popup from "../MaterialUI/Popup";
import Controls from "../MaterialUI/controls/Controls";
import { Form } from "../MaterialUI/useForm";

const questionType = ['Multiple Choice', 'True or False']

const QuestionWidget = (props) => {
    const [openDialog, setOpenDialog] = useState(false);
    const [previewMode, setPreviewMode]=useState(true);
    const [chooseCourseDialog, setChooseCourseDialog]=useState(false)
    const [anchorEl, setAnchorEl]=useState(null)
    const [chooseCourse,setChooseCourse]=useState({})
    const [duplicateDialog, setDuplicateDialog]=useState(false)
    const { question } = props;
    const updateQuestion=async(question)=>{
        question={
            id: question.id,
            choices: question.choices,
            courseId: question.course.id,
            objectiveId: question.objectives.map(objective=>objective.id),
            question: question.question,
            quizzes: question.quizzes,
            owner: question.owner
        }
        props.toastManager.add("Updating...",{appearance: 'info', autoDismiss: true})
        try{
            const url=`${API}/question`
            const result=await fetch(url,{
                method: 'PUT',
                headers:{
                    authorization: question.owner
                },
                body: JSON.stringify(question)
            });
            const res=await result.json();
            if(res.statusCode==200||res.statusCode==204){
                props.toastManager.add("Updated",{appearance:'success', autoDismiss:true}, ()=>setOpenDialog(false));
                props.fetchQuestion(question.owner, props.toastManager)
                props.fetchQuiz(question.owner, props.toastManager)
            }
        }catch(err){
            _error_handler(null,err,null);
            console.log(err);
        }
    }

    const duplicateQuestion = async (question) => {
        question = {
            choices: question.choices,
            courseId: question.course.id,
            objectiveId: question.objectives.map(objective => objective.id),
            question: question.question,
            quizzes: question.quizzes,
            owner: question.owner
        }
        props.toastManager.add("Duplicating...", { appearance: 'info', autoDismiss: true })
        try {
            const url = `${API}/question`
            const result = await fetch(url, {
                method: 'POST',
                headers: {
                    authorization: question.owner
                },
                body: JSON.stringify(question)
            });
            const res = await result.json();
            if (res.statusCode == 200 || res.statusCode == 204) {
                props.toastManager.add("Duplicated", { appearance: 'success', autoDismiss: true }, () => setOpenDialog(false));
                props.fetchQuestion(question.owner, props.toastManager)
                props.fetchQuiz(question.owner, props.toastManager)
            }
        } catch (err) {
            _error_handler(null, err, null);
            console.log(err);
        }
    }

    const handleClose=()=>{
        setAnchorEl(null)
    }

    return (
        <>
            <Grid item xs={12}>
                <Card
                    title={question.question.title}
                    type={questionType[question.question.type]}
                    viewable
                    viewInModal={() => setOpenDialog(true)}
                    menuId={"questionMenus"}
                    setAnchorEl={setAnchorEl}
                >
                </Card>
            </Grid>
            <ViewQuestion 
                openDialog={openDialog} 
                setOpenDialog={setOpenDialog} 
                {...props} 
                title={previewMode?'Preview Question':'Edit Question'} 
                previewMode={previewMode}
                setPreviewMode={setPreviewMode}
                setAnchorEl={setAnchorEl}
                handleSave={updateQuestion}
                recordForEdit={{
                    id: question._id, 
                    question: question.question, 
                    choices: question.choices.map((item)=>({isTrue: item.isTrue, choice: item.choice, pict: item.pict})), 
                    quizzes: question.quizId?question.quizId.map(quiz=>({ id: quiz._id, title: quiz.quizName })):[], 
                    course: { id: question.courseId._id, title: question.courseId.courseName }, 
                    objectives: question.objectiveId.map((item) => ({ id: item._id, title: item.objective })),
                    owner: question.owner
                }}
                currentCourse={{id: question.courseId._id, title: question.courseId.courseName}}
                courses={props.courses}
            />
            <ViewQuestion
                openDialog={duplicateDialog}
                setOpenDialog={setDuplicateDialog}
                title="Duplicate Question"
                setAnchorEl={setAnchorEl}
                handleSave={duplicateQuestion}
                recordForDuplicate={{
                    question: question.question, 
                    choices: question.choices.map((item)=>({isTrue: item.isTrue, choice: item.choice, pict: item.pict})), 
                    quizzes: chooseCourse.value==question.courseId._id&&question.quizId?question.quizId.map(quiz=>({ id: quiz._id, title: quiz.quizName })):[], 
                    course: {id: chooseCourse.value?chooseCourse.value:'', title: chooseCourse.value?props.courses.filter(course=>course._id==chooseCourse.value)[0].courseName:''}, 
                    objectives: chooseCourse.value==question.courseId._id?question.objectiveId.map((item) => ({ id: item._id, title: item.objective })):[],
                    owner: question.owner
                }}
                courses={props.courses}
                quizzes={props.quizzes}
            />
            <Popup open={chooseCourseDialog} handleClose={()=>setChooseCourseDialog(false)} maxWidth='sm' fullWidth title='Select Course' popupAction={
                <Button variant="contained" onClick={()=>{
                    if(!chooseCourse.value)return
                    setChooseCourseDialog(false)
                    setDuplicateDialog(true)
                }}>
                    Duplicate
                </Button>
            }>
                <Form>
                        <Controls.Select
                            style={{width: '100%'}}
                            name="Course"
                            label="Select Course"
                            options={props.courses.map(course=>({id: course._id, title: course.courseName}))}
                            value={chooseCourse.value||''}
                            onChange={(e)=>{
                                setChooseCourse({value: e.target.value, error: e.target.value?'':'Course must be selected'})
                            }}
                            error={chooseCourse.error||''}
                        />
                </Form>
            </Popup>
            <Menu
                id="questionMenus"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={()=>setOpenDialog(true)}>Preview</MenuItem>
                <MenuItem onClick={()=>{setPreviewMode(false); setOpenDialog(true)}}>Edit</MenuItem>
                <MenuItem onClick={()=>setChooseCourseDialog(true)}>Duplicate</MenuItem>
            </Menu>
        </>
    )
}

const mapDispatchToProps=dispatch=>{
    return{
        fetchQuestion: bindActionCreators(fetchQuestion, dispatch),
        fetchQuiz: bindActionCreators(fetchQuiz, dispatch)
    }
}

const mapStateToProps=state=>{
    return{
        courses: state.courseReducer.courses,
        quizzes: state.quizReducer.quizzes
    }
}

export default compose(
    withToastManager,
    connect(mapStateToProps,mapDispatchToProps)
)(QuestionWidget)