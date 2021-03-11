import { API } from "../../constant/ENV";
import {_error_handler} from '../../utils/errorHandler';

export const classroomActionTypes={
    FETCH_CR:"FETCH_CR"
}

export const fetchClassroom=(uid,toast)=>async dispatch=>{
    try{
        const url=`${API}/class`
        fetch(url,{
            method: 'GET',
            headers:{
                authorization: uid
            }
        }).then(response=>response.json()).then((resp)=>{
            if(resp.statusCode!=200){
                _error_handler(toast,resp);
                return;
            }
            return dispatch({
                type: classroomActionTypes.FETCH_CR,
                payload: resp.data.payload
            })
        });
    }catch(err){
        _error_handler(null,err,null);
        console.log(err);
    }
}