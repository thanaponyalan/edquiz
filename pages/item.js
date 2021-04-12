import MainLayout from "../containers/app/mainLayout";
import { useEffect, useState } from 'react';
import { compose } from "recompose";
import { withAuthSync } from "../utils/auth";
import Question from "../components/Question";
import { connect } from "react-redux";
import { fetchQuestion } from "../redux/actions/questionAction";
import { bindActionCreators } from "redux";
import Controls from "../components/MaterialUI/controls/Controls";
import { Add } from "@material-ui/icons";
import AddQuestion from "../components/Question/AddQuestion";
import { withToastManager } from "react-toast-notifications";
import { _error_handler } from "../utils/errorHandler";
import { API } from '../constant/ENV'
import { fetchQuiz } from "../redux/actions/quizAction";
import { Grid, Hidden, Typography } from "@material-ui/core";
import QuestionCourseWidget from "../components/Question/QuestionCourseWidget";

const questionType = [
    "Multiple Choice",
    "Match",
    "True or False"
]

const Item = (props) => {
    const [openDialog, setOpenDialog] = useState(false);
    const [distinctCourses, setDistinctCourses]=useState([])
    const insertQuestion = async (question) => {
        question = {
            choices: question.choices,
            courseId: question.course.id,
            objectiveId: question.objectives.map(objective => objective.id),
            params: question.params,
            question: question.question,
            quizId: question.quiz.id,
            quiz: question.quiz,
            owner: props.uid
        }
        props.toastManager.add("Creating...", { appearance: 'info', autoDismiss: true })
        try {
            const url = `${API}/item`
            const result = await fetch(url, {
                method: 'POST',
                headers: {
                    authorization: question.owner
                },
                body: JSON.stringify(question)
            });
            const res = await result.json();
            if (res.statusCode == 200 || res.statusCode == 204) {
                props.toastManager.add("Created", { appearance: 'success', autoDismiss: true }, () => setOpenDialog(false));
                props.fetchQuestion(question.owner, props.toastManager)
                props.fetchQuiz(question.owner, props.toastManager)
            }
        } catch (err) {
            _error_handler(null, err, null);
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

    const sort = (a, b) => {
        if (a.courseId.courseName < b.courseId.courseName) return -1;
        else if (b.courseId.courseName > a.courseId.courseName) return 1;
        return 0;
    }

    useEffect(()=>{
        if(props.questions.length){
            let tempDistinct=[...new Set(props.questions.sort(sort).map((question)=>question.courseId._id))];
            setDistinctCourses(tempDistinct.map((course) => ({id: course, isExpanded: false, title: props.questions.filter(question=>question.courseId._id==course)[0].courseId.courseName})))
        }
    },[props.questions])

    return (
        <>
            <MainLayout title="Questions" pageActions={addItem}>
                <Grid container spacing={2}>
                    <Hidden smDown>
                        <Grid item md={6} xs={12}>
                            <Grid container spacing={2} >
                                {
                                    distinctCourses && distinctCourses.filter((course, i) => i % 2 == 0).map((course, i) => {
                                        return <QuestionCourseWidget key={i} course={course} distinctCourses={distinctCourses} setDistinctCourses={setDistinctCourses} idx={i*2} insertQuestion={insertQuestion} />
                                    })
                                }
                            </Grid>
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <Grid container spacing={2}>
                                {
                                    distinctCourses && distinctCourses.filter((course, i) => i % 2 !== 0).map((course, i) => {
                                        return <QuestionCourseWidget key={i} course={course} distinctCourses={distinctCourses} setDistinctCourses={setDistinctCourses} idx={(i*2)+1} insertQuestion={insertQuestion} />
                                    })
                                }
                            </Grid>
                        </Grid>
                    </Hidden>
                    <Hidden mdUp>
                        {
                            distinctCourses && distinctCourses.map((course, i) => {
                                return <QuestionCourseWidget key={i} course={course} distinctCourses={distinctCourses} setDistinctCourses={setDistinctCourses} idx={i} insertQuestion={insertQuestion} />
                            })
                        }
                    </Hidden>
                </Grid>
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