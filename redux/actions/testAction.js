import {_error_handler} from '../../utils/errorHandler';
import { API } from "../../constant/ENV";

export const testActionTypes={
    FETCH_TEST: "FETCH_TEST",
    SET_TEST: "SET_TEST"
}

export const fetchTest=(uid,toast)=>async(dispatch)=>{
    try{
        const url=`${API}/test`
        const testRes=await fetch(url,{
            method: 'GET',
            headers:{
                authorization: uid
            }
        });
        const tests=await testRes.json();
        if(tests.statusCode!=200){
            _error_handler(toast,resp);
        }
        return dispatch({
            type: testActionTypes.FETCH_TEST,
            payload: tests.data.payload
        });
    }catch(err){
        _error_handler(null,err,null);
        console.log(err);
    }
}

export const setTest=(tests)=>(dispatch)=>{
    return dispatch({
        type: testActionTypes.SET_TEST,
        payload: tests.data.payload
    })
}