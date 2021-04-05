import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withToastManager } from 'react-toast-notifications';
import { bindActionCreators, compose } from 'redux'
import { fetchQuestionByQuizId, setQuestion } from '../../redux/actions/questionAction';
import AnswerQuestion from '../Question/AnswerQuestion';
import AnswerMatching from '../Question/AnswerMatching';
import { _error_handler } from '../../utils/errorHandler';
import { API } from '../../constant/ENV';

const DoAssignment=(props)=>{
    const {quizId,uid,questions,setOpenDialog, assignmentId}=props;
    const [currentIndex,setCurrentIndex]=useState(0);
    const [answered,setAnswered]=useState([])
    
    useEffect(()=>{
        props.setQuestion({data:{payload: []}})
        props.fetchQuestionByQuizId(quizId,uid,props.toastManager)
    },[])

    useEffect(()=>{
        if(questions){
            if(answered.length===questions.length){
                console.log(`Submit`);
                storeResult(answered)
                

                // setOpenDialog(false)   
            }
        }
    },[answered])

    const storeResult=async(questions)=>{
        const examResult={
            assignmentId: assignmentId,
            studentId: uid,
            questions
        }
        props.toastManager.add("Storing...",{appearance: 'info', autoDismiss: true})
        try{
            const url=`${API}/history`
            const result=await fetch(url,{
                method: 'POST',
                headers:{
                    authorization: uid
                },
                body: JSON.stringify(examResult)
            })
            const res=await result.json();
            if(res.statusCode==200||res.statusCode==204){
                props.toastManager.add("Stored",{appearance:'success', autoDismiss:true}, ()=>setOpenDialog(false));
                // props.fetchClass(props.uid,props.toastManager)
            }
        }catch(err){
            _error_handler(null,err,null);
            console.log(err);
        }
        console.log(examResult);
    }

    const handleChooseAnswer=(answer)=>{
        console.log(answer);
        if(questions[currentIndex].question.type!==1){
            const isCorrect=answer.isTrue
            setAnswered([...answered,{questionId: questions[currentIndex]._id, score: isCorrect?1:0}])
        }else{
            setAnswered([...answered,{questionId: questions[currentIndex]._id, score: answer.score}])
        }
        setCurrentIndex(currentIndex+1)
    }

    return (
        questions&&questions[currentIndex]?(
            questions[currentIndex].question.type!==1 ?
            <AnswerQuestion item={questions[currentIndex]} handleChooseAnswer={handleChooseAnswer}/>
            :
            <AnswerMatching item={questions[currentIndex]} handleChooseAnswer={handleChooseAnswer} />
        ):questions&&questions.length>0&&answered.length===questions.length?
        (<div>{`Your Score is ${answered.reduce((prev,cur)=>{return prev+cur.score},0)}`}</div>):(<div>loading...</div>)
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
        fetchQuestionByQuizId: bindActionCreators(fetchQuestionByQuizId,dispatch),
        setQuestion: bindActionCreators(setQuestion,dispatch)
    }
}

export default compose(
    connect(mapStateToProps,mapDispatchToProps),
    withToastManager
)(DoAssignment)