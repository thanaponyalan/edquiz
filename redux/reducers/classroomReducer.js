import {classroomActionTypes} from '../actions/classroomAction';

const initState={

}

const classroomReducer=(state=initState,action)=>{
    switch (action.type) {
        case classroomActionTypes.FETCH_CR:{
            return{
                ...state,
                data: action.payload
            };
        }
    
        default:
            return state;
    }
}

export default classroomReducer;