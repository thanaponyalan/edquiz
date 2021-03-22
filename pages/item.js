import MainLayout from "../containers/app/mainLayout";
import { useState } from 'react';
import { compose } from "recompose";
import { withAuthSync } from "../utils/auth";
import Question from "../components/Question";
import { connect } from "react-redux";
import { fetchQuestion } from "../redux/actions/questionAction";
import { bindActionCreators } from "redux";
import { Row } from "reactstrap";
import Controls from "../components/MaterialUI/controls/Controls";
import { Add } from "@material-ui/icons";
import AddQuestion from "../components/Question/AddQuestion";
import { withToastManager } from "react-toast-notifications";
import { _error_handler } from "../utils/errorHandler";
import {API} from '../constant/ENV'
import { fetchQuiz } from "../redux/actions/quizAction";

const questionType = [
    "Multiple Choice",
    "Match",
    "True or False"
]



const Item = (props) => {
    const [openDialog, setOpenDialog] = useState(false);
    const insertQuestion=async(question)=>{
        question={
            choices: question.choices,
            courseId: question.course.id,
            objectiveId: question.objectives.map(objective=>objective.id),
            params: question.params,
            question: question.question,
            quizId: question.quiz.id,
            quiz: question.quiz,
            owner: props.uid
        }
        props.toastManager.add("Creating...",{appearance: 'info', autoDismiss: true})
        try{
            const url=`${API}/item`
            const result=await fetch(url,{
                method: 'POST',
                headers:{
                    authorization: question.owner
                },
                body: JSON.stringify(question)
            });
            const res=await result.json();
            if(res.statusCode==200||res.statusCode==204){
                props.toastManager.add("Created",{appearance:'success', autoDismiss:true}, ()=>setOpenDialog(false));
                props.fetchQuestion(question.owner, props.toastManager)
                props.fetchQuiz(question.owner, prop.toastManager)
            }
        }catch(err){
            _error_handler(null,err,null);
            console.log(err);
        }
    }

    const addItem =
        <li className="nav-item">
            <Controls.Fab
                onClick={() => setOpenDialog(true)}>
                <Add />
            </Controls.Fab>
        </li>;


    return (
        <>
            <MainLayout title="Items" pageActions={addItem}>
                <Row>
                    {
                        props.questions.length && props.questions.map((item, i) =>
                            <Question key={i} question={{...item}} courses={props.courses} quizzes={props.quizzes} />
                        )
                    }
                </Row>
            </MainLayout>
            <AddQuestion openDialog={openDialog} setOpenDialog={setOpenDialog} title="Add Item" courses={props.courses} quizzes={props.quizzes} handleSave={insertQuestion} />
        </>
    )
}

const mapDispatchToProps = dispatch => {
    return {
        fetchQuestion: bindActionCreators(fetchQuestion, dispatch),
        fetchQuiz: bindActionCreators(fetchQuiz, dispatch)
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
    withAuthSync,
    withToastManager
)(Item);