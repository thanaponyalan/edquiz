import {_error_handler} from '../../utils/errorHandler';
import { API } from "../../constant/ENV";

export const historyActionTypes={
    FETCH_HISTORY: "FETCH_HISTORY",
    SET_HISTORY: "SET_HISTORY"
}

export const fetchHistory=(uid,assignmentId,toast)=>async(dispatch)=>{
    try{
        const url=`${API}/history?assignmentId=${assignmentId}`
        const historyRes=await fetch(url,{
            method: 'GET',
            headers:{
                authorization: uid
            }
        });
        const history=await historyRes.json();
        if(history.statusCode!=200){
            _error_handler(toast,resp);
        }
        return dispatch({
            type: historyActionTypes.FETCH_HISTORY,
            payload: history.data.payload
        });
    }catch(err){
        _error_handler(null,err,null);
        console.log(err);
    }
}

export const setHistory=(history)=>(dispatch)=>{
    return dispatch({
        type: historyActionTypes.SET_HISTORY,
        payload: history.data.payload
    })
}