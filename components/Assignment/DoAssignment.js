import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withToastManager } from 'react-toast-notifications';
import { bindActionCreators, compose } from 'redux'
import { fetchQuestionByQuizId, setQuestion } from '../../redux/actions/questionAction';
import AnswerQuestion from '../Question/AnswerQuestion';
import AnswerMatching from '../Question/AnswerMatching';
import { _error_handler } from '../../utils/errorHandler';
import { API } from '../../constant/ENV';
import { fetchAssignment } from '../../redux/actions/assignmentAction';
import Loader from 'react-loader-spinner';
import { fetchHistory } from '../../redux/actions/historyAction';

const DoAssignment=(props)=>{
    const {quizId,uid,questions,setOpenDialog, assignmentId, questionId, history}=props;
    const [currentIndex,setCurrentIndex]=useState(0);
    const [answered,setAnswered]=useState([])
    const [filteredQuestions, setFilteredQuestions]=useState()

    useEffect(()=>{
        if(!currentIndex){
            if(!questions){
                props.fetchQuestionByQuizId(quizId,uid,props.toastManager)
            }else{
                if(questions.some(question=>questionId.findIndex(qId=>qId==question._id)!=-1)){
                    props.fetchQuestionByQuizId(quizId,uid,props.toastManager)
                }
            }
            props.fetchHistory(uid,assignmentId)
        }
    },[])

    useEffect(()=>{
        if(questions){
            if(answered.length===questions.length){
                markAsDone();
            }
        }
    },[answered])

    const markAsDone=async()=>{
        const data={
            state: 'markAsDone',
            assignmentId: assignmentId
        }
        // props.toastManager.add("Loading...",{appearance: 'info', autoDismiss: true})
        try{
            const url=`${API}/assignment`
            const result=await fetch(url,{
                method: 'PUT',
                headers:{
                    authorization: uid
                },
                body: JSON.stringify(data)
            })
            const res=await result.json();
            if(res.statusCode==200||res.statusCode==204){
                // props.toastManager.add("Success",{appearance:'success', autoDismiss:true});
            }
        }catch(err){
            _error_handler(null,err,null);
            console.log(err);
        }
    }
    
    useEffect(()=>{
        if(!currentIndex){
            if(questions?.length){
                if(history?.questions.length){
                    const done=history.questions.map(question=>({questionId: question.questionId, score: question.score}))
                    setAnswered([...done])
                    setFilteredQuestions(questions.filter(question=>done.findIndex(id=>id.questionId==question._id)==-1))
                }else{
                    setAnswered([])
                    setFilteredQuestions(questions)
                }
            }
        }
    },[questions,history])

    const handleChooseAnswer=async(answer)=>{
        const isCorrect=answer.isTrue
        const question={questionId: filteredQuestions[currentIndex]._id, score: isCorrect?1:0}
        setAnswered([...answered,question])
        const data={
            assignmentId: assignmentId,
            studentId: uid,
            question: question
        }
        // props.toastManager.add("Loading...",{appearance: 'info', autoDismiss: true})
        try{
            const url=`${API}/history`
            const result=await fetch(url,{
                method: 'PUT',
                headers:{
                    authorization: uid
                },
                body: JSON.stringify(data)
            })
            const res=await result.json();
            if(res.statusCode==200||res.statusCode==204){
                // props.toastManager.add("Loaded",{appearance:'success', autoDismiss:true});
                setCurrentIndex(currentIndex+1)
            }
        }catch(err){
            _error_handler(null,err,null);
            console.log(err);
        }
    }

    console.log(filteredQuestions, currentIndex, questions, answered);

    return (
        filteredQuestions&&filteredQuestions[currentIndex]?
            <AnswerQuestion key={currentIndex} item={filteredQuestions[currentIndex]} handleChooseAnswer={handleChooseAnswer}/>
            :
            questions&&questions.length>0&&answered.length===questions.length?
                <div>{`Your Score is ${answered.reduce((prev,cur)=>{return prev+cur.score},0)}`}</div>
                :
                <div
                    style={{
                        width: '100%',
                        height: '100',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <Loader type="TailSpin" color="#2bad60" height="100" width="100"/>
                </div>
    )
}

const mapStateToProps=state=>{
    return{
        questions: state.questionReducer.questions,
        uid: state.authReducer.uid,
        history: state.historyReducer.history
    }
}

const mapDispatchToProps=dispatch=>{
    return{
        fetchQuestionByQuizId: bindActionCreators(fetchQuestionByQuizId,dispatch),
        setQuestion: bindActionCreators(setQuestion,dispatch),
        fetchAssignment: bindActionCreators(fetchAssignment, dispatch),
        fetchHistory: bindActionCreators(fetchHistory, dispatch)
    }
}

export default compose(
    connect(mapStateToProps,mapDispatchToProps),
    withToastManager
)(DoAssignment)