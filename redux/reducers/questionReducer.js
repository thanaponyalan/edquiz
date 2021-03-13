import { questionActionTypes } from '../actions/questionAction';

const initialCoursesState={

}
// [{
//     _id: null,
//     courseName: null,
//     courseNo: null,
//     courseDescription: null,
//     objectives: [],
//     owner: null
// }]

const questionReducer=(state=initialCoursesState, action)=>{
    switch (action.type) {
        case questionActionTypes.FETCH_QUESTION:
            return {...state,questions: action.payload};
        case questionActionTypes.SET_QUESTION:
            return {...state,questions: action.payload};
        default:
            return state;
    }
}

export default questionReducer;