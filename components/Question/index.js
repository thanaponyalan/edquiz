import { useState } from "react";
import { connect } from "react-redux";
import { withToastManager } from "react-toast-notifications";
import { compose } from "recompose";
import { bindActionCreators } from "redux";
import { API } from "../../constant/ENV";
import { fetchQuestion } from "../../redux/actions/questionAction";
import Card from "../ReactStrap/Card";
import ViewQuestion from "./AddQuestion";

const questionType = ['Multiple Choice', 'Match', 'True or False']

const QuestionWidget = (props) => {
    const [openDialog, setOpenDialog] = useState(false);
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
            }
        }catch(err){
            _error_handler(null,err,null);
            console.log(err);
        }
    }
    return (
        <>
            <Card
                title={question.question.title}
                type={questionType[question.question.type]}
                viewable
                viewInModal={() => setOpenDialog(true)}
            >
            </Card>
            <ViewQuestion 
                openDialog={openDialog} 
                setOpenDialog={setOpenDialog} 
                {...props} 
                title="Preview Item" 
                handleSave={updateQuestion}
                recordForEdit={{
                    id: question._id, 
                    question: question.question, 
                    choices: question.choices.map((item)=>({isTrue: item.isTrue, choice: item.choice, pict: item.pict})), 
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
        </>
    )
}

const mapDispatchToProps=dispatch=>{
    return{
        fetchQuestion: bindActionCreators(fetchQuestion, dispatch),
    }
}

export default compose(
    withToastManager,
    connect(null,mapDispatchToProps)
)(QuestionWidget)