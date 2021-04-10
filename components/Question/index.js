import { useState } from "react";
import { connect } from "react-redux";
import { withToastManager } from "react-toast-notifications";
import { compose } from "recompose";
import { bindActionCreators } from "redux";
import { API } from "../../constant/ENV";
import { fetchQuestion } from "../../redux/actions/questionAction";
import { fetchQuiz } from "../../redux/actions/quizAction";
import Card from "../MaterialUI/Card";
import ViewQuestion from "./AddQuestion";
import { Menu, MenuItem, Button, Grid } from "@material-ui/core";

const questionType = ['Multiple Choice', 'Match', 'True or False']

const QuestionWidget = (props) => {
    const [openDialog, setOpenDialog] = useState(false);
    const [previewMode, setPreviewMode]=useState(true);
    const [anchorEl, setAnchorEl]=useState(null)
    const { question } = props;
    const updateQuestion=async(question)=>{
        question={
            id: question.id,
            choices: question.choices,
            courseId: question.course.id,
            objectiveId: question.objectives.map(objective=>objective.id),
            params: question.params,
            question: question.question,
            quizId: question.quiz.id,
            quiz: question.quiz,
            owner: question.owner
        }
        props.toastManager.add("Updating...",{appearance: 'info', autoDismiss: true})
        try{
            const url=`${API}/item`
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
                title="Preview Item" 
                previewMode={previewMode}
                setPreviewMode={setPreviewMode}
                setAnchorEl={setAnchorEl}
                handleSave={updateQuestion}
                recordForEdit={{
                    id: question._id, 
                    question: question.question, 
                    choices: question.question.type!=1?question.choices.map((item)=>({isTrue: item.isTrue, choice: item.choice, pict: item.pict})):question.choices.map((item)=>({answer: item.answer, choice: item.choice, pict: item.pict})), 
                    params: question.params, 
                    quiz: question.quizId?{ id: question.quizId._id, title: question.quizId.quizName }:{
                        title: 'Not In Test',
                        id: -1
                    }, 
                    course: { id: question.courseId._id, title: question.courseId.courseName }, 
                    objectives: question.objectiveId.map((item) => ({ id: item._id, title: item.objective })),
                    owner: question.owner
                }}
            />
            <Menu
                id="questionMenus"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={()=>setOpenDialog(true)}>Preview</MenuItem>
                <MenuItem onClick={()=>{setPreviewMode(false); setOpenDialog(true)}}>Edit</MenuItem>
                <MenuItem disabled>Duplicate</MenuItem>
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

export default compose(
    withToastManager,
    connect(null,mapDispatchToProps)
)(QuestionWidget)