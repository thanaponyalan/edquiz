import { courseActionTypes } from '../actions/courseAction';

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

const courseReducer=(state=initialCoursesState, action)=>{
    switch (action.type) {
        case courseActionTypes.FETCH_COURSE:
            return {...state,courses: action.payload};
        case courseActionTypes.SET_COURSE:
            return {...state,courses: action.payload};
        default:
            return state;
    }
}

export default courseReducer;