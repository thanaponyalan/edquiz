import {_error_handler} from '../../utils/errorHandler';

export const courseActionTypes={
    FETCH_COURSE: "FETCH_COURSE",
    SET_COURSE: "SET_COURSE"
}

export const fetchCourse=(uid,toast)=>async(dispatch)=>{
    try{
        const url=`http://localhost:3000/api/course`
        const coursesRes=await fetch(url,{
            method: 'GET',
            headers:{
                authorization: uid
            }
        });
        const courses=await coursesRes.json();
        if(courses.statusCode!=200){
            _error_handler(toast,resp);
        }
        return dispatch({
            type: courseActionTypes.FETCH_COURSE,
            payload: courses.data.payload
        });
    }catch(err){
        _error_handler(null,err,null);
        console.log(err);
    }
}

export const setCourse=(courses)=>(dispatch)=>{
    return dispatch({
        type: courseActionTypes.SET_COURSE,
        payload: courses.data.payload
    })
}