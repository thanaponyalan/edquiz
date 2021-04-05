import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withToastManager } from 'react-toast-notifications';
import { bindActionCreators, compose } from 'redux'
import { fetchQuestionByQuizId, setQuestion } from '../../redux/actions/questionAction';

const Insight=(props)=>{
    const {quizId,uid,questions}=props;
    const [distinctObj,setDistinctObj]=useState([])

    useEffect(()=>{
        props.setQuestion({data:{payload: []}})
        props.fetchQuestionByQuizId(quizId,uid,props.toastManager)
    },[])

    useEffect(()=>{
        if(questions?.length){
            console.log(questions);
            const objectives=questions.map(question=>question.objectiveId)
            const obj=objectives.flat();
            setDistinctObj(obj.filter((item,idx)=>obj.findIndex(objItem=>objItem._id===item._id)===idx));
        }
    },[questions])

    // useEffect(()=>{
    //     const mapObjToQuestion=distinctObj.map(obj=>{
            
    //     })
    // },[distinctObj])

    console.log(distinctObj);
    
    return (
        <div>
            
        </div>
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
    connect(mapStateToProps, mapDispatchToProps),
    withToastManager
)(Insight)
