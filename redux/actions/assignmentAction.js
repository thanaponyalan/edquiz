import {_error_handler} from '../../utils/errorHandler';
import { API } from "../../constant/ENV";

export const assignmentActionTypes={
    FETCH_ASGN: "FETCH_ASGN",
    SET_ASGN: "SET_ASGN"
}

export const fetchAssignment=(uid,role='student',toast)=>async(dispatch)=>{
    try{
        const url=`${API}/assignment${role=='teacher'?`?isTeacher=1`:``}`
        const assignmentRes=await fetch(url,{
            method: 'GET',
            headers:{
                authorization: uid
            }
        });
        const assignments=await assignmentRes.json();
        if(assignments.statusCode!=200){
            _error_handler(toast,resp);
        }
        return dispatch({
            type: assignmentActionTypes.FETCH_ASGN,
            payload: assignments.data.payload
        });
    }catch(err){
        _error_handler(null,err,null);
        console.log(err);
    }
}

export const setAssignment=(assignments)=>(dispatch)=>{
    return dispatch({
        type: assignmentActionTypes.SET_ASGN,
        payload: assignments.data.payload
    })
}