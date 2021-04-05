import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withToastManager } from 'react-toast-notifications';
import { bindActionCreators, compose } from 'redux'
import { fetchQuestionByQuizId } from '../../redux/actions/questionAction';
import AnswerQuestion from '../Question/AnswerQuestion';
import AnswerMatching from '../Question/AnswerMatching';

const DoAssignment=(props)=>{
    const {quizId,uid,questions}=props;
    const [currentIndex,setCurrentIndex]=useState(0);
    const [answered,setAnswered]=useState([])
    
    useEffect(()=>{
        props.fetchQuestionByQuizId(quizId,uid,props.toastManager)
    },[])

    useEffect(()=>{
        console.log(answered);
        if(questions){
            if(answered.length===questions.length){
                console.log(`Submit`);
            }
        }
    },[answered])

    const handleChooseAnswer=(answer)=>{
        const isCorrect=answer.isTrue
        console.log(answer);
        setAnswered([...answered,{questionId: questions[currentIndex]._id, isCorrect: isCorrect}])
        setCurrentIndex(currentIndex+1)
    }

    return (
        questions&&questions[currentIndex]?(
            questions[currentIndex].question.type!=1 ?
            <AnswerQuestion item={questions[currentIndex]} handleChooseAnswer={handleChooseAnswer}/>
            :
            <AnswerMatching item={questions[currentIndex]} handleChooseAnswer={handleChooseAnswer} />
        ):(<div>loading...</div>)
    )
}

const mapStateToProps=state=>{
    return{
        questions: state.questionReducer.questions,
        uid: state.authReducer.uid
    }
}

const mapDispatchToProps=dispatch=>{
    return{
        fetchQuestionByQuizId: bindActionCreators(fetchQuestionByQuizId,dispatch)
    }
}

export default compose(
    connect(mapStateToProps,mapDispatchToProps),
    withToastManager
)(DoAssignment)