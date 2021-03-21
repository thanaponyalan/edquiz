import {_error_handler} from '../../utils/errorHandler';
import { API } from "../../constant/ENV";

export const quizActionTypes={
    FETCH_QUIZ: "FETCH_QUIZ",
    SET_QUIZ: "SET_QUIZ"
}

export const fetchQuiz=(uid,toast)=>async(dispatch)=>{
    try{
        const url=`${API}/test`
        const quizRes=await fetch(url,{
            method: 'GET',
            headers:{
                authorization: uid
            }
        });
        const quizzes=await quizRes.json();
        if(quizzes.statusCode!=200){
            _error_handler(toast,resp);
        }
        return dispatch({
            type: quizActionTypes.FETCH_QUIZ,
            payload: quizzes.data.payload
        });
    }catch(err){
        _error_handler(null,err,null);
        console.log(err);
    }
}

export const setQuiz=(quizzes)=>(dispatch)=>{
    return dispatch({
        type: quizActionTypes.SET_QUIZ,
        payload: quizzes.data.payload
    })
}