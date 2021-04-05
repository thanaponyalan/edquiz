import {_error_handler} from '../../utils/errorHandler';
import { API } from "../../constant/ENV";

export const questionActionTypes={
    FETCH_QUESTION: "FETCH_QUESTION",
    SET_QUESTION: "SET_QUESTION"
}

export const fetchQuestion=(uid,toast)=>async(dispatch)=>{
    try{
        const url=`${API}/item`
        const questionRes=await fetch(url,{
            method: 'GET',
            headers:{
                authorization: uid
            }
        });
        const questions=await questionRes.json();
        if(questions.statusCode!=200){
            _error_handler(toast,resp);
        }
        return dispatch({
            type: questionActionTypes.FETCH_QUESTION,
            payload: questions.data.payload
        });
    }catch(err){
        _error_handler(null,err,null);
        console.log(err);
    }
}

export const fetchQuestionByQuizId=(quizId,uid,toast)=>async(dispatch)=>{
    try{
        const url=`${API}/item?quizId=${quizId}`
        const questionRes=await fetch(url,{
            method: 'GET',
            headers:{
                authorization: uid
            }
        })
        const questions=await questionRes.json();
        if(questions.statusCode!=200){
            _error_handler(toast,resp);
        }
        return dispatch({
            type: questionActionTypes.FETCH_QUESTION,
            payload: questions.data.payload
        });
    }catch(err){
        _error_handler(null,err,null);
        console.log(err);
    }
}

export const setQuestion=(questions)=>(dispatch)=>{
    return dispatch({
        type: questionActionTypes.SET_QUESTION,
        payload: questions.data.payload
    })
}