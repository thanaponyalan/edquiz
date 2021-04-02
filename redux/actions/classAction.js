import {_error_handler} from '../../utils/errorHandler';
import { API } from "../../constant/ENV";

export const classActionTypes={
    FETCH_CLASS: "FETCH_CLASS",
    SET_CLASS: "SET_CLASS"
}

export const fetchClass=(uid,toast)=>async(dispatch)=>{
    try{
        const url=`${API}/class?isTeacher=1`
        const classRes=await fetch(url,{
            method: 'GET',
            headers:{
                authorization: uid
            }
        });
        const classes=await classRes.json();
        if(classes.statusCode!=200){
            _error_handler(toast,resp);
        }
        return dispatch({
            type: classActionTypes.FETCH_CLASS,
            payload: classes.data.payload
        });
    }catch(err){
        _error_handler(null,err,null);
        console.log(err);
    }
}

export const setClass=(classes)=>(dispatch)=>{
    return dispatch({
        type: classActionTypes.SET_CLASS,
        payload: classes.data.payload
    })
}